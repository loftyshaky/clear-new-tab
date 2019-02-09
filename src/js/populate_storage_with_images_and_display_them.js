'use_strict';

import { observable, action, configure } from 'mobx';
import resizeImage from 'resize-image';
import * as r from 'ramda';

import x from 'x';

import { db } from 'js/init_db';
import * as get_new_future_img from 'js/get_new_future_img';
import * as upload_messages from 'js/upload_messages';
import * as total_number_of_imgs from 'js/total_number_of_imgs';
import * as generate_random_color from 'js/generate_random_color';

configure({ enforceActions: 'observed' });

const settings = page === 'options' ? require('options/settings') : null; // eslint-disable-line global-require
const ui_state = page === 'options' ? require('options/ui_state') : null; // eslint-disable-line global-require

//> pack images and insert them in db
export const populate_storage_with_images = async (type, status, imgs, theme_img_info, theme_id) => {
    try {
        if (page === 'options') {
            mut.uploading_imgs = true;
        }

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

        const thumbnails = {};
        //>1 create thumbnails and get natural width and height
        if (type !== 'color') {
            await Promise.all(imgs.map(async (item, i) => {
                try {
                    await new Promise(async (resolve, reject) => {
                        const img = new Image();

                        img.onload = async () => {
                            try {
                                const natural_hidth = img.naturalWidth;
                                const natural_height = img.naturalHeight;

                                thumbnails[i] = {
                                    width: natural_hidth,
                                    height: natural_height,
                                };

                                if (type !== 'link') {
                                    const thumbnail_dimensions = calculate_img_aspect_ratio_fit(natural_hidth, natural_hidth);
                                    const base64 = resizeImage.resize(img, thumbnail_dimensions.width, thumbnail_dimensions.height, resizeImage.PNG);

                                    thumbnails[i].thumbnail = base64;
                                }

                                resolve();

                            } catch (er) {
                                show_or_hide_upload_error_messages('rejected');

                                err(er, 174);
                            }
                        };

                        img.onerror = () => {
                            try {
                                reject(er_obj('Failed to load image.'));

                            } catch (er) {
                                show_or_hide_upload_error_messages('rejected');

                                err(er, 175);
                            }
                        };

                        img.src = typeof item === 'string' ? item : URL.createObjectURL(item);
                    });
                } catch (er) {
                    show_or_hide_upload_error_messages('rejected');

                    err(er, 173, null, false, false, true);
                }
            }));
        }
        //<1 create thumbnails and get natural width and height

        const packed_imgs = imgs.map((item, i) => {
            if (type !== 'color') {
                const img = {
                    id: x.unique_id(),
                    position_id: position_id + i,
                    theme_id,
                    img: item,
                    thumbnail: thumbnails[i].thumbnail,
                    width: thumbnails[i].width,
                    height: thumbnails[i].height,
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

        if (page === 'options') {
            const number_of_img_w = sa('.img_w').length || 0;
            if (number_of_img_w < con.imgs_per_page) {
                const mode = 'upload_imgs';
                const imgs_to_load = packed_imgs.slice(0, con.imgs_per_page - number_of_img_w); // get first 50 of uploaded images

                unpack_and_load_imgs(mode, imgs_to_load);

            } else {
                total_number_of_imgs.set_total_number_of_imgs_and_switch_to_last_or_previous_page();
            }


            await x.send_message_to_background_c({ message: 'retrieve_imgs' }); //> reload img_a in background.js
        }

        const current_img = await ed('current_img');
        await get_new_future_img.get_new_future_img(current_img + 1);
        await x.send_message_to_background({ message: 'preload_img' });
        x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'reload_img' }]);

        if (page === 'options') {
            set_last_uploaded_image_as_current();
        }

        show_or_hide_upload_error_messages(status);

        return last_img_id;

    } catch (er) {
        err(er, 172);

        show_or_hide_upload_error_messages('resolved_with_errors');
    }

    return undefined;
};
//< pack images and insert them in db

const set_last_uploaded_image_as_current = async () => {
    try {
        const ed_all = await eda();

        if (ed_all.set_last_uploaded && (ed_all.mode === 'one' || ed_all.mode === 'multiple')) {
            const number_of_imgs = await db.imgs.count();
            const visible_value = number_of_imgs;
            const value_to_insert_into_db = number_of_imgs - 1;

            settings.change_current_img_insert_in_db(visible_value, value_to_insert_into_db);
        }
    } catch (er) {
        err(er, 176);
    }
};

//> prepare images for loading in images fieldset and then load them into it
export const unpack_and_load_imgs = async (mode, imgs_to_load, null_scroll_to) => {
    try {
        const unpacked_imgs = imgs_to_load.map(img => ({
            key: x.unique_id(),
            id: img.id,
            placeholder_color: generate_random_color.generate_random_pastel_color(),
            img: img.type.indexOf('file') > -1 ? img.thumbnail || URL.createObjectURL(img.img) : img.img,
            type: img.type,
            img_size: img.width ? (`${img.width}x${img.height}`) : '?',
            show_delete: true,
            selected: false,
        }));

        if (mode === 'load_page') {
            create_loaded_imgs_on_page_change(unpacked_imgs, null_scroll_to);

        } else if (mode === 'img_delete') {
            create_loaded_imgs_on_img_load(unpacked_imgs, true);

        } else {
            total_number_of_imgs.set_total_number_of_imgs_and_switch_to_last_or_previous_page(unpacked_imgs);
        }

    } catch (er) {
        err(er, 177);
    }
};
//< prepare images for loading in images fieldset and then load them into it

//> insert images in images fieldset (set state)
export const create_loaded_imgs_on_page_change = action((imgs, null_scroll_to) => {
    try {
        if (!null_scroll_to) {
            mut.scroll_to = mut.uploading_imgs ? 'bottom' : 'top';

        } else {
            mut.scroll_to = null;
        }

        set_previous_number_of_imgs(0);

        ob.imgs.replace(imgs);

        mut.uploading_imgs = false;

    } catch (er) {
        err(er, 178);
    }
});

export const create_loaded_imgs_on_img_load = action((imgs, null_scroll_to) => {
    try {
        mut.scroll_to = null_scroll_to ? null : 'bottom';

        set_previous_number_of_imgs(ob.imgs.length);

        const all_imgs = ob.imgs.concat(imgs); // visible + uploaded now images

        ob.imgs.replace(all_imgs);

        mut.uploading_imgs = false;

    } catch (er) {
        err(er, 179);
    }
});

const set_previous_number_of_imgs = number_of_imgs => {
    try {
        mut.previous_number_of_imgs = number_of_imgs;

    } catch (er) {
        err(er, 180);
    }
};
//< insert images in images fieldset (set state)

export const show_or_hide_upload_error_messages = status => {
    try {
        if (page === 'options') {
            ui_state.enable_ui();

            upload_messages.hide_upload_box_messages();

            if (status === 'rejected' || status === 'resolved_with_errors') {
                upload_messages.show_upload_box_error_message();
            }

            if (status === 'resolved_paste') {
                upload_messages.change_paste_input_placeholder_val(null);
            }

            if (status === 'rejected_paste') {
                upload_messages.change_paste_input_placeholder_val(x.msg('upload_box_error_message_text'));
            }
        }

    } catch (er) {
        err(er, 181);
    }
};

const calculate_img_aspect_ratio_fit = (src_width, src_height) => {
    try {
        const ratio = Math.min(Infinity / src_width, 98 / src_height);

        return { width: src_width * ratio, height: src_height * ratio };

    } catch (er) {
        err(er, 182);
    }

    return undefined;
};

export const mut = {
    previous_number_of_imgs: 0,
    scroll_to: null,
    uploading_imgs: true,
};

export const con = {
    imgs_per_page: 200,
};

export const ob = observable({
    imgs: [],
});
