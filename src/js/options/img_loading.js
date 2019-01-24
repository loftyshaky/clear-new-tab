import { observable, action, runInAction, configure } from 'mobx';
import * as r from 'ramda';

import x from 'x';
import { db } from 'js/init_db';
import * as shared_b_o from 'js/shared_b_o';
import * as upload_messages from 'js/upload_messages';
import * as populate_storage_with_images_and_display_them from 'js/populate_storage_with_images_and_display_them';
import * as total_number_of_imgs from 'js/total_number_of_imgs';
import { inputs_data } from 'options/inputs_data';
import * as shared_o from 'options/shared_o';
import * as pagination from 'options/pagination';

configure({ enforceActions: 'observed' });

//> paste image or image url
export const get_pasted_image_or_image_url = async e => {
    shared_o.disable_ui();
    upload_messages.hide_upload_box_messages();
    upload_messages.change_paste_input_placeholder_val(x.msg('upload_box_uploading_message_text'));

    const clipboard_items = e.clipboardData.items;
    const clipboard_text = e.clipboardData.getData('text');
    const input_given_text = clipboard_text !== '';
    const contains_allow_downloading_images_by_link_permission = inputs_data.obj.upload.download_img_when_link_given.val;

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
        populate_storage_with_images_and_display_them.populate_storage_with_images('file', 'resolved_paste', [img], {}, null);

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

            populate_storage_with_images_and_display_them.populate_storage_with_images('link', 'resolved_paste', [clipboard_text], {}, null);

        } catch (er) {
            console.error(er);

            populate_storage_with_images_and_display_them.show_or_hide_upload_error_messages('rejected_paste');
        }

    } else { // if anything other (error)
        populate_storage_with_images_and_display_them.show_or_hide_upload_error_messages('rejected_paste');
    }

    shared_o.enable_ui();
};
//< paste image or image url

//> filter files loaded with upload box (keep only images) and call put in db function
export const handle_files = async files => {
    shared_o.disable_ui();
    upload_messages.change_paste_input_placeholder_val(null);
    upload_messages.hide_upload_box_messages();
    upload_messages.show_upload_box_uploading_message();

    const valid_file_types = ['image/gif', 'image/jpeg', 'image/png'];
    const filter_out_non_imgs = r.filter(img => r.indexOf(img.type, valid_file_types) > -1);
    const get_put_in_db_f = imgs => {
        const files_len = files.length;
        const get_f = r.cond([
            [r.equals(0), () => r.partial(populate_storage_with_images_and_display_them.show_or_hide_upload_error_messages, ['rejected'])], // all files are not images
            [r.equals(files_len), () => r.partial(populate_storage_with_images_and_display_them.populate_storage_with_images, ['file', 'resolved', imgs, {}, null])], // all files are images
            [r.compose(r.not, r.equals(files_len)), () => r.partial(populate_storage_with_images_and_display_them.populate_storage_with_images, ['file', 'resolved_with_errors', imgs, {}, null])], // some files are not images
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

    populate_storage_with_images_and_display_them.populate_storage_with_images('color', 'resolved_color', [color], {}, null);

    shared_o.set_color_input_vizualization_color('upload', 'create_solid_color_img', color);
};
//< create_solid_color_img

//> create images on extensions' options page on load or click on load btn
export const load_page = async (mode, page) => { // g
    shared_o.disable_ui();

    try {
        const offset = page * shared_b_o.sta.imgs_per_page - shared_b_o.sta.imgs_per_page;

        if (mode === 'load_page') {
            pagination.change_page(page);
        }

        const imgs = await db.imgs.orderBy('position_id').offset(offset).limit(shared_b_o.sta.imgs_per_page).toArray();
        const number_of_imgs = imgs.length;

        if (number_of_imgs > 0) {
            populate_storage_with_images_and_display_them.unpack_and_load_imgs(mode, imgs, null);
        }

        if (number_of_imgs === 0) {
            hide_loading_screen();

            shared_o.enable_ui();
        }

        if (mode === 'load_page') {
            change_css_counter_offset(offset);
        }

    } catch (er) {
        console.error(er);
    }
};
//< create images on extensions' options page on load or click on load btn

const change_css_counter_offset = action(offset => {
    ob.css_counter_offset = offset;
});

//> show one image after it fully loaded
export const show_loaded_img = async (id, img_el) => {
    await x.delay(100);

    const i = shared_o.get_img_i_by_id(id);
    const is_img = img_el; // not color

    runInAction(() => {
        if (shared_b_o.ob.imgs[i]) {
            shared_b_o.ob.imgs[i].show = true;
        }

        if (is_img) {
            shared_b_o.ob.imgs[i].img_size = `${img_el.naturalWidth}x${img_el.naturalHeight}`;
        }
    });
};
//< show one image after it fully loaded

//> show transparency background checkerboard
export const show_checkerboard = async id => {
    await x.delay(100);

    const i = shared_o.get_img_i_by_id(id);

    runInAction(() => {
        if (shared_b_o.ob.imgs[i]) {
            shared_b_o.ob.imgs[i].show_checkerboard = true;
        }
    });
};
//< show transparency background checkerboard

export const hide_loading_screen = action(() => { ob.show_loading_screen = false; }); //> hide loading_screen when images loaded on options page load

export const mut = {
    imgs_loaded: 0,
    total_imgs_to_load: 0,
    previous_number_of_imgs: 0,
};

export const ob = observable({
    show_loading_screen: true,
    css_counter_offset: 0,
});
