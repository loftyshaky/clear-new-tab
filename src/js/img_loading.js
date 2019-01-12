import { observable, action, runInAction, configure } from 'mobx';
import * as r from 'ramda';

import x from 'x';
import { db } from 'js/init_db';
import * as shared_o from 'options/shared_o';
import * as shared_b_o from 'js/shared_b_o';

configure({ enforceActions: true });

//> paste image or image url
export const get_pasted_image_or_image_url = async e => {
    shared_o.disable_ui();
    hide_upload_box_messages();
    change_paste_input_placeholder_val(x.msg('upload_box_uploading_message_text'));

    const clipboard_items = e.clipboardData.items;
    const clipboard_text = e.clipboardData.getData('text');
    const input_given_text = clipboard_text !== '';
    const contains_allow_downloading_images_by_link_permission = shared_o.ob.hidable_input_items.download_img_when_link_given;

    const img = await r.ifElse(
        () => contains_allow_downloading_images_by_link_permission && ed.download_img_when_link_given && input_given_text,
        async () => {
            try {
                const response = await window.fetch(clipboard_text);
                const blob = await response.blob();
                if (blob.type.indexOf('image') > -1) {
                    const file_object = new File([blob], '', { type: blob.type }); // '' is file name, it means that file object was created from blob object

                    return file_object;

                }

                throw 'File given is not image.';

            } catch (er) {
                console.error(er);
            }

            return undefined;
        },

        () => {
            const img_clipboard_item = r.find(clipboard_item => clipboard_item.type.indexOf('image') > -1, clipboard_items);// ordinary for each will not work | check if img (its file object (after it will be converted with getAsFile below) if is) pasted

            const file_object = img_clipboard_item ? img_clipboard_item.getAsFile() : null;

            return file_object;
        },
    )();

    const is_file = img;

    if (is_file) {
        populate_storage_with_images('file', 'resolved_paste', [img], {}, null);

    } else if (input_given_text) { // if link
        try {
            await new Promise((resolve, reject) => {
                const test_img = new Image();

                test_img.onload = () => {
                    resolve();
                };

                test_img.onerror = () => {
                    reject();
                };

                test_img.src = clipboard_text;
            });

            populate_storage_with_images('link', 'resolved_paste', [clipboard_text], {}, null);

        } catch (er) {
            console.error(er);

            show_or_hide_upload_error_messages('rejected_paste');
        }

    } else { // if anything other (error)
        show_or_hide_upload_error_messages('rejected_paste');
    }

    shared_o.enable_ui();
};
//< paste image or image url

//> filter files loaded with upload box (keep only images) and call put in db function
export const handle_files = async files => {
    shared_o.disable_ui();
    change_paste_input_placeholder_val(null);
    hide_upload_box_messages();
    show_upload_box_uploading_message();

    const valid_file_types = ['image/gif', 'image/jpeg', 'image/png'];
    const filter_out_non_imgs = r.filter(img => r.indexOf(img.type, valid_file_types) > -1);
    const get_put_in_db_f = imgs => {
        const files_len = files.length;
        const get_f = r.cond([
            [r.equals(0), () => r.partial(show_or_hide_upload_error_messages, ['rejected'])], // all files are not images
            [r.equals(files_len), () => r.partial(populate_storage_with_images, ['file', 'resolved', imgs, {}, null])], // all files are images
            [r.compose(r.not, r.equals(files_len)), () => r.partial(populate_storage_with_images, ['file', 'resolved_with_errors', imgs, {}, null])], // some files are not images
        ]);

        return get_f(imgs.length);
    };


    const put_in_db_p = r.pipe(filter_out_non_imgs, get_put_in_db_f);

    await put_in_db_p(files)();

    shared_o.enable_ui();
};
//< filter files loaded with upload box (keep only images) and call put in db function

//> create_solid_color_img
export const create_solid_color_img = color => {
    shared_o.mut.current_color_pickier.el = null;

    populate_storage_with_images('color', 'resolved_color', [color], {}, null);

    shared_o.set_color_input_vizualization_color('create_solid_color_img', color);
};
//< create_solid_color_img

//> pack images and insert them in db
export const populate_storage_with_images = async (type, status, imgs, theme_img_info, theme_id) => {
    try {
        //>1 pack images
        const add_theme_modifier_to_type = () => (r.isEmpty(theme_img_info) ? type : `theme_${type}`);

        const number_of_imgs = await db.imgs.count();
        const position_id = await r.ifElse(() => number_of_imgs > 0,
            async () => {
                const ordered_imgs = db.imgs.orderBy('position_id');
                const img_with_highest_id = await ordered_imgs.last();

                return img_with_highest_id.position_id + 1;
            },

            () => 0)();

        const packed_imgs = imgs.map((item, i) => {
            if (type !== 'color') {
                const img = {
                    id: x.unique_id(),
                    position_id: position_id + i,
                    theme_id,
                    img: item,
                    type: add_theme_modifier_to_type(),
                    size: theme_img_info.size || 'global',
                    position: theme_img_info.position || 'global',
                    repeat: theme_img_info.repeat || 'global',
                    color: theme_img_info.color || 'global',
                };

                return img;

            } if (type === 'color') {
                const img = {
                    id: x.unique_id(),
                    position_id: position_id + i,
                    theme_id,
                    img: item,
                    type: add_theme_modifier_to_type(),
                };

                return img;
            }

            return undefined;
        });
        //<1 pack images

        //>1 insert image packs in db
        const last_img_id = await db.transaction('rw', db.imgs, () => db.imgs.bulkAdd(packed_imgs));
        //<1 insert image packs in db

        const number_of_img_w = sa('.img_w').length;

        if (number_of_img_w < 50) {
            const mode = 'load_more';
            const imgs_to_load = packed_imgs.slice(0, 50 - number_of_img_w); // get first 50 of uploaded images

            shared_o.unpack_and_load_imgs(imgs_to_load, mode, 0);

        } else {
            hide_or_show_load_btns('uploaded_imgs_but_not_added_any_imgs_to_ui');
        }

        //>1 reload img_a in background.js
        if (page === 'options') {
            await x.send_message_to_background_c({ message: 'retrieve_imgs' });
        }
        //>1 reload img_a in background.js

        await shared_b_o.get_new_future_img(ed.current_img + 1);
        await x.send_message_to_background({ message: 'preload_img' });
        x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'reload_img' }]);
        show_or_hide_upload_error_messages(status);

        return last_img_id;

    } catch (er) {
        console.error(er);

        show_or_hide_upload_error_messages('resolved_with_errors');

        x.error(1);
    }

    return undefined;
};
//< pack images and insert them in db

//> create images on extensions' options page on load or click on load btn
export const load_50_or_all_imgs = async (limit, mode) => { // g
    shared_o.disable_ui();

    try {
        const imgs = await db.imgs.orderBy('position_id').offset(shared_o.mut.offset).limit(limit).toArray();
        const number_of_imgs = imgs.length;

        mut.loading_all = !!(mode === 'load_all' && number_of_imgs > 0);

        if (number_of_imgs > 0) {
            await shared_o.calculate_offset(mode);

            shared_o.unpack_and_load_imgs(imgs, mode, 0);
        }

        if (number_of_imgs === 0) {
            hide_loading_screen();

            shared_o.enable_ui();
        }

    } catch (er) {
        console.error(er);
    }
};
//< create images on extensions' options page on load or click on load btn

//> insert images in images fieldset (set state)
export const create_loaded_imgs = action(imgs => {
    shared_o.ob.imgs.replace(r.union(shared_o.ob.imgs.slice())(imgs));

    const last_inserted_img_id = imgs[imgs.length - 1] ? imgs[imgs.length - 1].id : 'uploaded_imgs_but_not_added_any_imgs_to_ui';

    hide_or_show_load_btns(last_inserted_img_id);
});
//< insert images in images fieldset (set state)

//> show one image after it fully loaded
export const show_loaded_img = async (id, img_el) => {
    await x.delay(100);

    const i = shared_o.get_img_i_by_id(id);
    const is_img = img_el; // not color

    runInAction(() => {
        if (shared_o.ob.imgs[i]) {
            shared_o.ob.imgs[i].show = true;
        }

        if (is_img) {
            shared_o.ob.imgs[i].img_size = `${img_el.naturalWidth}x${img_el.naturalHeight}`;
        }
    });
};
//< show one image after it fully loaded

//> show transparency background checkerboard
export const show_checkerboard = async id => {
    await x.delay(100);

    const i = shared_o.get_img_i_by_id(id);

    runInAction(() => {
        if (shared_o.ob.imgs[i]) {
            shared_o.ob.imgs[i].show_checkerboard = true;
        }
    });
};
//< show transparency background checkerboard

const show_or_hide_upload_error_messages = status => {
    hide_upload_box_messages();

    if (status === 'rejected' || status === 'resolved_with_errors') {
        show_upload_box_error_message();
    }

    if (status === 'resolved_paste') {
        change_paste_input_placeholder_val(null);
    }

    if (status === 'rejected_paste') {
        change_paste_input_placeholder_val(x.msg('upload_box_error_message_text'));
    }
};

const hide_or_show_load_btns = async last_inserted_img_id => {
    try {
        const number_of_imgs = await db.imgs.count();
        const last_img_in_db = await db.imgs.orderBy('position_id').last();
        const there_is_img_after_last_inserted_img = !!(last_inserted_img_id === 'uploaded_imgs_but_not_added_any_imgs_to_ui' || last_inserted_img_id !== last_img_in_db.id);

        runInAction(() => {
            if (number_of_imgs > 50 && there_is_img_after_last_inserted_img) {
                shared_o.ob.show_load_btns_w = true;

            } else {
                shared_o.ob.show_load_btns_w = false;
            }
        });

    } catch (er) {
        console.error(er);
    }
};

const hide_upload_box_messages = action(() => {
    ob.upload_box_uploading_message_none_cls = 'none';
    ob.upload_box_error_message_none_cls = 'none';
});

const show_upload_box_error_message = action(() => { ob.upload_box_error_message_none_cls = ''; });

const show_upload_box_uploading_message = action(() => { ob.upload_box_uploading_message_none_cls = ''; });

const change_paste_input_placeholder_val = action(val => { ob.paste_input_placeholder = val; });

export const hide_loading_screen = action(() => { ob.show_loading_screen = false; }); //> hide loading_screen when images loaded on options page load

export const generate_random_pastel_color = () => `hsl(${360 * Math.random()},${25 + 70 * Math.random()}%,${70 + 10 * Math.random()}%)`;

export const mut = {
    imgs_loaded: 0,
    total_imgs_to_load: 0,
    previous_number_of_imgs: 0,
    loading_all: false,
};

export const ob = observable({
    show_loading_screen: true,
    upload_box_uploading_message_none_cls: 'none',
    upload_box_error_message_none_cls: 'none',
    paste_input_placeholder: '',
});
