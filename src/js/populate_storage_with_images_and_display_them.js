'use_strict';

import { observable, action, configure } from 'mobx';
import resizeImage from 'resize-image';
import * as r from 'ramda';

import x from 'x';

import { db } from 'js/init_db';
import { Video } from 'js/new_video';
import * as get_new_future_img from 'js/get_new_future_img';
import * as upload_messages from 'js/upload_messages';
import * as total_number_of_imgs from 'js/total_number_of_imgs';
import * as generate_random_color from 'js/generate_random_color';
import * as file_types from 'js/file_types';

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
        const number_of_imgs = await db.imgsd.count();
        const position_id = await r.ifElse(() => number_of_imgs > 0,
            async () => {
                const ordered_imgs = db.imgsd.orderBy('position_id');
                const img_with_highest_id = await ordered_imgs.last();

                return img_with_highest_id.position_id + 1;
            },

            () => 0)();

        const thumbnails = await create_thumbnails_and_get_natural_width_and_height(imgs, type);

        const packed_imgs = imgs.map(item => {
            const img = {
                id: x.unique_id(),
                img: item,
            };

            return img;
        });

        const packed_imgsd = imgs.map((item, i) => {
            if (type !== 'color') {
                const img = {
                    id: packed_imgs[i].id,
                    position_id: position_id + i,
                    theme_id,
                    thumbnail: thumbnails[i].thumbnail,
                    width: thumbnails[i].width,
                    height: thumbnails[i].height,
                    type: generate_type(item.type || 'img_link', theme_img_info),
                    size: theme_img_info.size || 'global',
                    position: theme_img_info.position || 'global',
                    repeat: theme_img_info.repeat || 'global',
                    color: theme_img_info.color || 'global',
                    video_volume: typeof theme_img_info.video_volume !== 'undefined' ? theme_img_info.video_volume : 'global',
                };

                return img;

            } if (type === 'color') {
                const img = {
                    id: packed_imgs[i].id,
                    position_id: position_id + i,
                    theme_id,
                    type: generate_type('color', theme_img_info),
                };

                return img;
            }

            return undefined;
        });
        //<1 pack images

        //>1 insert image packs in db
        const last_img_id = await db.transaction('rw', db.imgs, db.imgsd, () => {
            db.imgs.bulkAdd(packed_imgs);
            db.imgsd.bulkAdd(packed_imgsd);
        });
        //<1 insert image packs in db

        if (page === 'options') {
            const number_of_img_w = sa('.img_w').length || 0;
            if (number_of_img_w < con.imgs_per_page) {
                const mode = 'upload_imgs';
                const imgs_to_load = packed_imgsd.slice(0, con.imgs_per_page - number_of_img_w); // get first 50 of uploaded images

                unpack_and_load_imgs(mode, imgs_to_load);

            } else {
                total_number_of_imgs.set_total_number_of_imgs_and_switch_to_last_or_previous_page();
            }


            await x.send_message_to_background_c({ message: 'retrieve_imgs' }); //> reload img_a in background.js
        }

        const current_img = await ed('current_img');
        await get_new_future_img.get_new_future_img(current_img + 1);
        await x.send_message_to_background({ message: 'preload_img' });

        if (page === 'options') {
            set_last_uploaded_image_as_current();
        }

        show_or_hide_upload_error_messages(status);

        await x.send_message_to_background_c({ message: 'preload_img' });
        x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'reload_img' }]);

        return last_img_id;

    } catch (er) {
        err(er, 172);

        show_or_hide_upload_error_messages('resolved_with_errors');
    }

    return undefined;
};
//< pack images and insert them in db

const generate_type = (ext_or_type, theme_img_info) => {
    const type = file_types.con.exts[ext_or_type] || ext_or_type;
    const is_theme_file = !r.isEmpty(theme_img_info);
    const type_final = is_theme_file ? `${type}_theme` : type;

    return type_final;
};

const create_thumbnails_and_get_natural_width_and_height = async (imgs, type) => {
    const thumbnails = {};

    if (type !== 'color') {
        await Promise.all(imgs.map(async (item, i) => {
            try {
                await new Promise(async (resolve, reject) => {
                    const is_img = type === 'link' ? true : file_types.con.exts[item.type] === 'img_file';
                    const img = is_img ? new Image() : Video();

                    if (!is_img) {
                        img.addEventListener('loadedmetadata', () => {
                            img.currentTime = img.duration / 3;
                        });
                    }

                    img.addEventListener(is_img ? 'load' : 'loadeddata', async () => {
                        try {
                            const natural_width = img.naturalWidth || img.videoWidth;
                            const natural_height = img.naturalHeight || img.videoHeight;

                            thumbnails[i] = {
                                width: natural_width,
                                height: natural_height,
                            };

                            if (type === 'link') {
                                resolve();

                            } else {
                                const thumbnail_dimensions = calculate_img_aspect_ratio_fit(natural_width, natural_height);

                                if (is_img) {
                                    thumbnails[i].thumbnail = resizeImage.resize(img, thumbnail_dimensions.width, thumbnail_dimensions.height);

                                    resolve();

                                } else {
                                    const canvas = document.createElement('canvas');
                                    canvas.width = natural_width;
                                    canvas.height = natural_height;

                                    canvas.getContext('2d').drawImage(img, 0, 0, natural_width, natural_height);
                                    const base64_thumbnail = canvas.toDataURL();

                                    const not_resized_thumbnail = new Image();

                                    not_resized_thumbnail.onload = () => {
                                        try {
                                            thumbnails[i].thumbnail = resizeImage.resize(not_resized_thumbnail, thumbnail_dimensions.width, thumbnail_dimensions.height, resizeImage.PNG);

                                            resolve();

                                        } catch (er) {
                                            show_or_hide_upload_error_messages('rejected');

                                            err(er, 223);
                                        }
                                    };

                                    not_resized_thumbnail.onerror = () => {
                                        try {
                                            reject(er_obj('Failed to load img.'));

                                        } catch (er) {
                                            show_or_hide_upload_error_messages('rejected');

                                            err(er, 222);
                                        }
                                    };

                                    not_resized_thumbnail.src = base64_thumbnail;
                                }
                            }

                        } catch (er) {
                            show_or_hide_upload_error_messages('rejected');

                            err(er, 174);
                        }
                    });

                    img.onerror = () => {
                        try {
                            reject(er_obj('Failed to load img.'));

                        } catch (er) {
                            show_or_hide_upload_error_messages('rejected');

                            err(er, 175);
                        }
                    };

                    img.src = typeof item === 'string' ? item : URL.createObjectURL(item);

                    if (!is_img) {
                        img.load();
                    }
                });

            } catch (er) {
                show_or_hide_upload_error_messages('rejected');

                err(er, 173, null, false, false, true);
            }
        }));
    }

    return thumbnails;
};

const set_last_uploaded_image_as_current = async () => {
    try {
        const ed_all = await eda();

        if (ed_all.set_last_uploaded && (ed_all.mode === 'one' || ed_all.mode === 'multiple')) {
            const number_of_imgs = await db.imgsd.count();
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
        const unpacked_imgs = await Promise.all(imgs_to_load.map(async img_data => {
            const img = await db.imgs.get(img_data.id); // get full image for backwards compability. Replace with this later: !file_types.con.files[img_data.type] ? await db.imgs.get(img_data.id) : null;

            return {
                key: x.unique_id(),
                id: img_data.id,
                placeholder_color: generate_random_color.generate_random_pastel_color(),
                img: file_types.con.files[img_data.type] ? img_data.thumbnail || URL.createObjectURL(img.img) : img.img,
                type: img_data.type,
                img_size: img_data.width ? (`${img_data.width}x${img_data.height}`) : '?',
                show_delete: true,
                selected: false,
            };
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
