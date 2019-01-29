import { action, configure } from 'mobx';
import resizeImage from 'resize-image';
import * as r from 'ramda';

import x from 'x';

import { db } from 'js/init_db';
import * as shared_b_o from 'js/shared_b_o';
import * as upload_messages from 'js/upload_messages';
import * as total_number_of_imgs from 'js/total_number_of_imgs';

configure({ enforceActions: 'observed' });

const settings = page === 'options' ? require('options/settings') : null; // eslint-disable-line global-require

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
                await new Promise((resolve, reject) => {
                    const img = new Image();

                    img.onload = async () => {
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
                    };

                    img.onerror = () => {
                        reject();
                    };

                    img.src = typeof item === 'string' ? item : URL.createObjectURL(item);
                });
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
            if (number_of_img_w < sta.imgs_per_page) {
                const mode = 'upload_imgs';
                const imgs_to_load = packed_imgs.slice(0, sta.imgs_per_page - number_of_img_w); // get first 50 of uploaded images

                unpack_and_load_imgs(mode, imgs_to_load);

            } else {
                total_number_of_imgs.set_total_number_of_imgs_and_switch_to_last_or_previous_page();
            }


            await x.send_message_to_background_c({ message: 'retrieve_imgs' }); //> reload img_a in background.js
        }

        const current_img = await ed123('current_img');
        await shared_b_o.get_new_future_img(current_img + 1);
        await x.send_message_to_background({ message: 'preload_img' });
        x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'reload_img' }]);

        if (page === 'options') {
            show_or_hide_upload_error_messages(status);
        }

        return last_img_id;

    } catch (er) {
        console.error(er);

        if (page === 'options') {
            show_or_hide_upload_error_messages('resolved_with_errors');
        }

        x.error(1);
    }

    return undefined;
};
//< pack images and insert them in db

//> prepare images for loading in images fieldset and then load them into it
export const unpack_and_load_imgs = async (mode, imgs_to_load) => {
    const unpacked_imgs = imgs_to_load.map(img => ({
        key: x.unique_id(),
        id: img.id,
        placeholder_color: generate_random_pastel_color(),
        img: img.type.indexOf('file') > -1 ? img.thumbnail || URL.createObjectURL(img.img) : img.img,
        type: img.type,
        img_size: img.width ? (`${img.width}x${img.height}`) : '?',
        show_delete: true,
        selected: false,
    }));

    if (mode === 'load_page') {
        create_loaded_imgs_on_page_change(unpacked_imgs);

    } else if (mode === 'img_delete') {
        create_loaded_imgs_on_img_load(unpacked_imgs, true);

    } else {
        total_number_of_imgs.set_total_number_of_imgs_and_switch_to_last_or_previous_page(unpacked_imgs);
    }

    //>1 set last uploaded image as current
    const ed_all = await eda();

    if (mode === 'upload_imgs' && ed_all.set_last_uploaded && (ed_all.mode === 'one' || ed_all.mode === 'multiple')) {
        const number_of_imgs = await db.imgs.count();
        const visible_value = number_of_imgs;
        const value_to_insert_into_db = number_of_imgs - 1;

        settings.change_current_img_insert_in_db(visible_value, value_to_insert_into_db);
    }
    //<1 set last uploaded image as current
};
//< prepare images for loading in images fieldset and then load them into it

//> insert images in images fieldset (set state)
export const create_loaded_imgs_on_page_change = action(imgs => {
    mut.scroll_to = mut.uploading_imgs ? 'bottom' : 'top';

    set_previous_number_of_imgs(0);

    shared_b_o.ob.imgs.replace(imgs);

    mut.uploading_imgs = false;
});

export const create_loaded_imgs_on_img_load = action((imgs, null_scroll_to) => {
    mut.scroll_to = null_scroll_to ? null : 'bottom';

    set_previous_number_of_imgs(shared_b_o.ob.imgs.length);

    const all_imgs = shared_b_o.ob.imgs.concat(imgs); // visible + uploaded now images

    shared_b_o.ob.imgs.replace(all_imgs);

    mut.uploading_imgs = false;
});

const set_previous_number_of_imgs = number_of_imgs => {
    mut.previous_number_of_imgs = number_of_imgs;
};
//< insert images in images fieldset (set state)

export const show_or_hide_upload_error_messages = status => {
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
};

const calculate_img_aspect_ratio_fit = (src_width, src_height) => {
    const ratio = Math.min(Infinity / src_width, 98 / src_height);

    return { width: src_width * ratio, height: src_height * ratio };
};

const generate_random_pastel_color = () => `hsl(${360 * Math.random()},${25 + 70 * Math.random()}%,${70 + 10 * Math.random()}%)`;

export const mut = {
    previous_number_of_imgs: 0,
    scroll_to: null,
    uploading_imgs: true,
};

export const sta = {
    imgs_per_page: 200,
};
