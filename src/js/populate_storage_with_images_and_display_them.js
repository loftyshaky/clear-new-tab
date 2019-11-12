import { observable, action, configure } from 'mobx';
import resizeImage from 'resize-image';
import * as r from 'ramda';

import x from 'x';

import { db } from 'js/init_db';
import { Video } from 'js/new_video';
import * as get_new_future_background from 'js/get_new_future_background';
import * as total_number_of_backgrounds from 'js/total_number_of_backgrounds';
import * as generate_random_color from 'js/generate_random_color';
import * as file_types from 'js/file_types';
import * as convert_to_file_object from 'js/convert_to_file_object';

configure({ enforceActions: 'observed' });

const settings = page === 'options' ? require('options/settings') : null; // eslint-disable-line global-require
const ui_state = page === 'options' ? require('options/ui_state') : null; // eslint-disable-line global-require
const backgrounds_module = page === 'background' ? require('background/backgrounds') : null; // eslint-disable-line global-require

//> pack images and insert them in db
export const populate_storage_with_images = async (type, status, backgrounds, theme_background_info, theme_id, is_theme) => {
    try {
        if (page === 'options') {
            mut.uploading_backgrounds = true;
        }

        let some_thumbnails_not_loaded = false;

        //>1 pack images
        const number_of_backgrounds = await db.backgroundsd.count();
        const position_id = await r.ifElse(() => number_of_backgrounds > 0,
            async () => {
                const ordered_backgrounds = db.backgroundsd.orderBy('position_id');
                const background_with_highest_id = await ordered_backgrounds.last();

                return background_with_highest_id.position_id + 1;
            },

            () => 0)();

        const thumbnails = await create_thumbnails_and_get_natural_width_and_height(backgrounds, type);

        const packed_backgrounds = backgrounds.map((item, i) => {
            if (!thumbnails[i] || thumbnails[i].thumbnail !== 'error') {
                const background = {
                    id: x.unique_id(),
                    background: typeof item === 'string' ? item : convert_to_file_object.convert_to_file_object(item),
                };

                return background;

            }

            some_thumbnails_not_loaded = true;

            return null;
        });

        const packed_backgroundsd = backgrounds.map((item, i) => {
            if (!thumbnails[i] || thumbnails[i].thumbnail !== 'error') {
                if (type !== 'color') {
                    const background = {
                        id: packed_backgrounds[i].id,
                        position_id: position_id + i,
                        theme_id,
                        thumbnail: thumbnails[i] ? thumbnails[i].thumbnail : null,
                        width: thumbnails[i] ? thumbnails[i].width : null,
                        height: thumbnails[i] ? thumbnails[i].height : null,
                        type: generate_type(item.type || 'img_link', is_theme),
                        size: theme_background_info.size || 'global',
                        position: theme_background_info.position || 'global',
                        repeat: theme_background_info.repeat || 'global',
                        color: theme_background_info.color || 'global',
                        video_volume: typeof theme_background_info.video_volume !== 'undefined' ? theme_background_info.video_volume : 'global',
                    };

                    return background;

                } if (type === 'color') {
                    const background = {
                        id: packed_backgrounds[i].id,
                        position_id: position_id + i,
                        theme_id,
                        type: generate_type('color', is_theme),
                    };

                    return background;
                }
            }

            return null;
        });

        const packed_backgrounds_filtered = packed_backgrounds.filter(item => item);
        const packed_backgroundsd_filtered = packed_backgroundsd.filter(item => item);
        //<1 pack images

        //>1 insert image packs in db
        let last_background_id;

        if (packed_backgrounds_filtered.length > 0) {
            try {
                last_background_id = await db.transaction('rw', db.backgrounds, db.backgroundsd, () => {
                    db.backgrounds.bulkAdd(packed_backgrounds_filtered);
                    db.backgroundsd.bulkAdd(packed_backgroundsd_filtered);
                });

            } catch (er) {
                if (page === 'options') {
                    ui_state.exit_upload_mode('resolved_with_errors');
                }

                if (er.message.indexOf('QuotaExceededError') > -1) {
                    err(er_obj('Quota exceeded'), 275, 'quota_exceeded', false, false, true);

                } else {
                    err(er, 281, null, false, false, true);
                }
            }

        } else {
            if (page === 'options') {
                ui_state.exit_upload_mode('resolved_with_errors');
            }

            err(er_obj('Unable to create thumbnails of all uploaded images'), 276, null, true, false, true);
        }
        //<1 insert image packs in db

        if (page === 'options') {
            const number_of_background_w = sa('.background_w').length || 0;
            if (number_of_background_w < con.backgrounds_per_page) {
                const mode = 'upload_backgrounds';
                const backgrounds_to_load = packed_backgroundsd_filtered.slice(0, con.backgrounds_per_page - number_of_background_w); // get first 50 of uploaded images

                unpack_and_load_backgrounds(mode, backgrounds_to_load);

            } else {
                total_number_of_backgrounds.set_total_number_of_backgrounds_and_switch_to_last_or_previous_page();
            }


            await x.send_message_to_background_c({ message: 'retrieve_backgrounds' });
        }

        const current_background = await ed('current_background');

        await get_new_future_background.get_new_future_background(current_background + 1);

        if (page === 'options') {
            set_last_uploaded_image_as_current();
            ui_state.exit_upload_mode(some_thumbnails_not_loaded ? 'resolved_with_errors' : status);
            await x.send_message_to_background_c({ message: 'preload_background' });

        } else {
            await backgrounds_module.preload_current_and_future_background('reload');
        }

        x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'reload_background' }]);

        return last_background_id;

    } catch (er) {
        err(er, 172);

        if (page === 'options') {
            ui_state.exit_upload_mode('resolved_with_errors');
        }
    }

    return undefined;
};
//< pack images and insert them in db

const generate_type = (ext_or_type, is_theme) => {
    const type = file_types.con.exts[ext_or_type] || ext_or_type;
    const type_final = is_theme ? `${type}_theme` : type;

    return type_final;
};

const create_thumbnails_and_get_natural_width_and_height = async (backgrounds, type) => {
    const thumbnails = {};

    if (type !== 'color') {
        await Promise.all(backgrounds.map(async (item, i) => {
            try {
                await new Promise(async resolve => {
                    const is_img = type === 'link' ? true : file_types.con.exts[item.type] === 'img_file';
                    const background = is_img ? new window.Image() : Video();

                    if (!is_img) {
                        background.addEventListener('loadedmetadata', () => {
                            background.currentTime = background.duration / 3;
                        });
                    }

                    background.addEventListener(is_img ? 'load' : 'timeupdate', async () => {
                        try {
                            const natural_width = background.naturalWidth || background.videoWidth;
                            const natural_height = background.naturalHeight || background.videoHeight;

                            thumbnails[i] = {
                                width: natural_width,
                                height: natural_height,
                            };

                            if (type === 'link') {
                                resolve();

                            } else {
                                const thumbnail_dimensions = calculate_background_aspect_ratio_fit(natural_width, natural_height);

                                if (is_img) {
                                    const thumbnail = resizeImage.resize(background, thumbnail_dimensions.width, thumbnail_dimensions.height);

                                    thumbnails[i].thumbnail = thumbnail === 'data:,' ? null : thumbnail;

                                    resolve();

                                } else if (background.readyState === 4) {
                                    if (natural_width > 0) { // for firefox. When image is broken in firefox it returns natural_width 0
                                        const canvas = document.createElement('canvas');
                                        canvas.width = natural_width;
                                        canvas.height = natural_height;

                                        canvas.getContext('2d').drawImage(background, 0, 0, natural_width, natural_height);
                                        const base64_thumbnail = canvas.toDataURL();

                                        const not_resized_thumbnail = new window.Image();

                                        not_resized_thumbnail.onload = () => {
                                            try {
                                                thumbnails[i].thumbnail = resizeImage.resize(not_resized_thumbnail, thumbnail_dimensions.width, thumbnail_dimensions.height, resizeImage.PNG);

                                                resolve();

                                            } catch (er) {
                                                if (page === 'options') {
                                                    ui_state.exit_upload_mode('rejected');
                                                }

                                                err(er, 223);
                                            }
                                        };

                                        not_resized_thumbnail.onerror = () => {
                                            try {
                                                thumbnails[i].thumbnail = 'error';

                                                resolve();

                                            } catch (er) {
                                                if (page === 'options') {
                                                    ui_state.exit_upload_mode('rejected');
                                                }

                                                err(er, 222, null, true);
                                            }
                                        };

                                        not_resized_thumbnail.src = base64_thumbnail;

                                    } else {
                                        thumbnails[i].thumbnail = 'error';

                                        resolve();
                                    }
                                }
                            }

                        } catch (er) {
                            if (page === 'options') {
                                ui_state.exit_upload_mode('rejected');
                            }

                            err(er, 174, null, true);
                        }
                    });

                    background.onerror = () => {
                        try {
                            thumbnails[i].thumbnail = 'error';

                            resolve();

                        } catch (er) {
                            if (page === 'options') {
                                ui_state.exit_upload_mode('rejected');
                            }

                            err(er, 175, null, true);
                        }
                    };

                    background.src = typeof item === 'string' ? item : URL.createObjectURL(item);

                    if (!is_img) {
                        background.load();
                    }
                });

            } catch (er) {
                if (page === 'options') {
                    ui_state.exit_upload_mode('rejected');
                }

                err(er, 173, null, true);
            }
        }));
    }

    return thumbnails;
};

const set_last_uploaded_image_as_current = async () => {
    try {
        const ed_all = await eda();

        if (ed_all.set_last_uploaded && (ed_all.mode === 'one' || ed_all.mode === 'multiple')) {
            const number_of_backgrounds = await db.backgroundsd.count();
            const visible_value = number_of_backgrounds;
            const value_to_insert_into_db = number_of_backgrounds - 1;

            settings.change_current_background_insert_in_db(visible_value, value_to_insert_into_db);
        }
    } catch (er) {
        err(er, 176);
    }
};

//> prepare images for loading in images fieldset and then load them into it
export const unpack_and_load_backgrounds = async (mode, backgrounds_to_load, null_scroll_to) => {
    try {
        const unpacked_backgrounds = await Promise.all(backgrounds_to_load.map(async background_data => {
            const background = await db.backgrounds.get(background_data.id); // get full image for backwards compability. Replace with this later: !file_types.con.files[background_data.type] ? await db.backgrounds.get(background_data.id) : null;

            return {
                key: x.unique_id(),
                id: background_data.id,
                placeholder_color: generate_random_color.generate_random_pastel_color(),
                background: file_types.con.files[background_data.type] ? background_data.thumbnail || URL.createObjectURL(background.background) : background.background,
                type: background_data.type,
                background_size: background_data.width ? (`${background_data.width}x${background_data.height}`) : '?',
                show_delete: true,
                selected: false,
            };
        }));

        if (mode === 'load_page') {
            create_loaded_backgrounds_on_page_change(unpacked_backgrounds, null_scroll_to);

        } else if (mode === 'background_delete') {
            create_loaded_backgrounds_on_background_load(unpacked_backgrounds, true);

        } else {
            total_number_of_backgrounds.set_total_number_of_backgrounds_and_switch_to_last_or_previous_page(unpacked_backgrounds);
        }

    } catch (er) {
        err(er, 177);
    }
};
//< prepare images for loading in images fieldset and then load them into it

//> insert images in images fieldset (set state)
export const create_loaded_backgrounds_on_page_change = action((backgrounds, null_scroll_to) => {
    try {
        if (!null_scroll_to) {
            mut.scroll_to = mut.uploading_backgrounds ? 'bottom' : 'top';

        } else {
            mut.scroll_to = null;
        }

        set_previous_number_of_backgrounds(0);

        ob.backgrounds.replace(backgrounds);

        mut.uploading_backgrounds = false;

    } catch (er) {
        err(er, 178);
    }
});

export const create_loaded_backgrounds_on_background_load = action((backgrounds, null_scroll_to) => {
    try {
        mut.scroll_to = null_scroll_to ? null : 'bottom';

        set_previous_number_of_backgrounds(ob.backgrounds.length);

        const all_backgrounds = ob.backgrounds.concat(backgrounds); // visible + uploaded now images

        ob.backgrounds.replace(all_backgrounds);

        mut.uploading_backgrounds = false;

    } catch (er) {
        err(er, 179);
    }
});

const set_previous_number_of_backgrounds = number_of_backgrounds => {
    try {
        mut.previous_number_of_backgrounds = number_of_backgrounds;

    } catch (er) {
        err(er, 180);
    }
};
//< insert images in images fieldset (set state)

const calculate_background_aspect_ratio_fit = (src_width, src_height) => {
    try {
        const ratio = Math.min(Infinity / src_width, 98 / src_height);

        return { width: src_width * ratio, height: src_height * ratio };

    } catch (er) {
        err(er, 182);
    }

    return undefined;
};

export const mut = {
    previous_number_of_backgrounds: 0,
    scroll_to: null,
    uploading_backgrounds: true,
};

export const con = {
    backgrounds_per_page: 200,
};

export const ob = observable({
    backgrounds: [],
});
