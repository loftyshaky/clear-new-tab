import * as r from 'ramda';
import jszip from 'jszip';
import jszip_utils from 'jszip-utils';

import x from 'x';
import { db } from 'js/init_db';
import * as analytics from 'js/analytics';
import * as get_new_future_background from 'js/get_new_future_background';
import * as populate_storage_with_images_and_display_them from 'js/populate_storage_with_images_and_display_them';
import * as determine_theme_current_background from 'js/determine_theme_current_background';
import * as convert_to_file_object from 'js/convert_to_file_object';
import * as backgrounds from 'background/backgrounds';

//> download theme crx, unpack it, access theme data from theme crx manifest, download theme image
export const get_theme_background = async (theme_id, reinstall_even_if_theme_background_already_exist, tab_id, first_call) => {
    const ed_all = await eda();

    if (ed_all.mode === 'theme') {
        try {
            const installing_theme_background_already_exist = r.find(r.propEq('theme_id', theme_id), backgrounds.mut.backgrounds);
            let new_current_background;

            if ((!ed_all.keep_old_themes_backgrounds && reinstall_even_if_theme_background_already_exist) || !installing_theme_background_already_exist) {
                mut.uploading_theme_background = true;

                analytics.send_event('theme_background', 'loaded');

                x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'enter_upload_mode' }]);

                const theme_package = await new jszip.external.Promise((resolve, reject) => {
                    jszip_utils.getBinaryContent(`https://clients2.google.com/service/update2/crx?response=redirect&x=id%3D${theme_id}%26uc&prodversion=32`, (er, theme_package_) => {
                        if (er) {
                            reject(er);
                            err(er, 47, null, true);

                        } else {
                            resolve(theme_package_);
                        }
                    });
                });

                const theme_package_data = await jszip.loadAsync(theme_package);
                const manifest = await theme_package_data.file('manifest.json').async('string');
                const manifest_obj = JSON.parse(manifest.trim()); // trim fixes bug with some themes. ex: https://chrome.google.com/webstore/detail/sexy-girl-chrome-theme-ar/pkibpgkliocdchedibhioiibdiddomac
                const theme_obj = manifest_obj.theme;
                const img_name = r.path(['images', 'theme_ntp_background'], theme_obj);
                const position_prop = r.path(['properties', 'ntp_background_alignment'], theme_obj);
                const repeat_prop = r.path(['properties', 'ntp_background_repeat'], theme_obj);
                const size_prop = r.path(['clear_new_tab', 'size'], theme_obj);
                const video_volume_prop = r.path(['clear_new_tab', 'video_volume'], theme_obj);
                const position = con.positions.indexOf(position_prop) > -1 ? con.positions_dict[position_prop] : con.positions_dict.center;
                const repeat = con.repeats.indexOf(repeat_prop) > -1 ? repeat_prop : 'no-repeat';
                const size = con.sizes.indexOf(size_prop) > -1 ? size_prop : 'global';
                const video_volume = video_volume_prop >= 0 && video_volume_prop <= 100 ? +video_volume_prop : 'global';
                const color_rgb = r.path(['colors', 'ntp_background'], theme_obj);
                const color = color_rgb ? `#${rgb_to_hex(color_rgb)}` : '#ffffff';
                const theme_background_info = {
                    position,
                    repeat,
                    color,
                    size,
                    video_volume,
                };

                const is_valid_img = img_name ? img_name_ => con.valid_file_types.some(ext => img_name_.includes(ext)) : null;

                if (is_valid_img && !is_valid_img(img_name) && what_browser !== 'chrome') {
                    throw 'Image is not valid image'; // eslint-disable-line no-throw-literal
                }

                await delete_previous_themes_backgrounds();

                await r.ifElse(
                    () => img_name,

                    async () => {
                        try {
                            let clear_new_tab_video = await theme_package_data.file('clear_new_tab_video.mp4');

                            if (!clear_new_tab_video) {
                                clear_new_tab_video = await theme_package_data.file('clear_new_tab_video.webm');
                            }

                            if (!clear_new_tab_video) {
                                clear_new_tab_video = await theme_package_data.file('clear_new_tab_video.ogv');
                            }

                            const theme_background = await theme_package_data.file(img_name); // download theme image
                            const theme_img_or_video = clear_new_tab_video || theme_background || await theme_package_data.file(img_name.charAt(0).toUpperCase() + img_name.slice(1)); // download theme image (convert first letter of image name to uppercase)
                            const type = clear_new_tab_video ? `video/${get_file_extension(clear_new_tab_video.name)}` : `image/${get_file_extension(img_name)}`;
                            const blob = await theme_img_or_video.async('blob');
                            const file_object = convert_to_file_object.convert_to_file_object(blob, type);

                            return await populate_storage_with_images_and_display_them.populate_storage_with_images('file', 'resolved', [file_object], theme_background_info, theme_id);

                        } catch (er) {
                            err(er, 45, null, true);
                        }

                        return undefined;
                    },

                    async () => {
                        try {
                            await populate_storage_with_images_and_display_them.populate_storage_with_images('color', 'resolved', [color], null, theme_id);

                        } catch (er) {
                            err(er, 46, null, true);
                        }
                    },
                )();

                await db.ed.update(1, { last_installed_theme_theme_id: theme_id });
                await backgrounds.retrieve_backgrounds();

                new_current_background = await determine_theme_current_background.determine_theme_current_background(theme_id, backgrounds.mut.backgrounds);

                x.iterate_all_tabs(x.send_message_to_tab, [{
                    message: 'load_last_page',
                }]);

            } else { // when undoing theme
                const last_installed_theme_theme_id = what_browser === 'chrome' ? await get_installed_theme_id() : theme_id;

                await db.ed.update(1, { last_installed_theme_theme_id });

                new_current_background = await determine_theme_current_background.determine_theme_current_background(last_installed_theme_theme_id, backgrounds.mut.backgrounds);
            }

            if (!first_call || mut.uploading_theme_background) {
                await db.ed.update(1, { current_background: new_current_background });
                await get_new_future_background.get_new_future_background(new_current_background + 1);
                await backgrounds.preload_current_and_future_background('reload');

                x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'change_current_background_input_val' }]);
                x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'reload_background' }]);
                x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'exit_upload_mode_and_deselect_background', status: 'resolved' }]);

                mut.uploading_theme_background = false;
            }

            return 'success';

        } catch (er) {
            err(er, 42, null, true);

            try {
                if (what_browser !== 'chrome') {
                    await x.send_message_to_tab_c(tab_id, { message: 'notify_about_paid_theme_error' });
                }

            } catch (er2) {
                err(er2, 43, null, true);
            }

            x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'exit_upload_mode_and_deselect_background', status: 'rejected' }]);

            mut.uploading_theme_background = false;

            return 'error';
        }

    } else if (what_browser !== 'chrome') {
        try {
            await x.send_message_to_tab_c(tab_id, { message: 'notify_about_wrong_mode' });

        } catch (er) {
            err(er, 44, null, true);
        }
    }

    return undefined;
};
//< download theme crx, unpack it, access theme data from theme crx manifest, download theme image

const delete_previous_themes_backgrounds = async () => {
    try {
        const ed_all = await eda();

        if (ed_all.mode === 'theme' && await !ed_all.keep_old_themes_backgrounds) {
            const theme_backgrounds = backgrounds.mut.backgrounds.filter(background => {
                try {
                    return background.theme_id;

                } catch (er) {
                    err(er, 49, null, true);
                }

                return undefined;
            });

            const at_least_one_theme_image_found = theme_backgrounds[0];

            if (at_least_one_theme_image_found) {
                const ids_of_theme_backgrounds_to_delete_final = theme_backgrounds.map(background => {
                    try {
                        return background.id;

                    } catch (er) {
                        err(er, 50, null, true);
                    }

                    return undefined;
                });

                await db.transaction('rw', db.backgrounds, db.backgroundsd, async () => {
                    db.backgrounds.bulkDelete(ids_of_theme_backgrounds_to_delete_final);
                    db.backgroundsd.bulkDelete(ids_of_theme_backgrounds_to_delete_final);
                });
            }
        }

    } catch (er) {
        err(er, 48, null, true);
    }

    return [];
};

const rgb_to_hex = r.pipe(r.map(val => {
    try {
        return val.toString(16).padStart(2, '0');

    } catch (er) {
        err(er, 51, null, true);
    }

    return undefined;

}), r.join(''));

//> on theme installiation
if (what_browser === 'chrome') {
    browser.management.onEnabled.addListener(ext_info => {
        try {
            if (ext_info.type === 'theme') {
                get_theme_background(ext_info.id, true);
            }

        } catch (er) {
            err(er, 52, null, true);
        }
    });
}
//< on theme installiation

export const get_installed_theme_id = () => new Promise(resolve => {
    browser.management.getAll(async all_apps => {
        try {
            const last_installed_theme_theme_id = await ed('last_installed_theme_theme_id');
            const enabled_themes_without_last_installed = all_apps.filter(app => {
                try {
                    return app.type === 'theme' && app.enabled === true && app.id !== last_installed_theme_theme_id;

                } catch (er) {
                    err(er, 54, null, true);
                }

                return undefined;
            });

            const themes = enabled_themes_without_last_installed.length === 0 ? all_apps.filter(app => {
                try {
                    return app.type === 'theme' && app.enabled === true;

                } catch (er) {
                    err(er, 55, null, true);
                }

                return undefined;

            }) : enabled_themes_without_last_installed;

            const theme_id = themes.length > 0 ? themes[0].id : null;

            resolve(theme_id);

        } catch (er) {
            err(er, 53, null, true);
        }
    });
});

const get_file_extension = filename => {
    let ext = filename.split('.').pop();

    if (ext === 'jpg') {
        ext = 'jpeg';

    } else if (ext === 'ogv') {
        ext = 'ogg';
    }

    return ext;
};

const con = {
    positions_dict: {
        top: '50% 0%',
        center: '50% 50%',
        bottom: '50% 100%',
        'left top': '0% 0%',
        'top left': '0% 0%',
        'left center': '0% 50%',
        'center left': '0% 50%',
        'left bottom': '0% 100%',
        'bottom left': '0% 100%',
        'right top': '100% 0%',
        'top right': '100% 0%',
        'right center': '100% 50%',
        'center right': '100% 50%',
        'right bottom': '100% 100%',
        'bottom right': '100% 100%',
    },
    valid_file_types: ['.gif', '.jpeg', '.jpg', '.png'],
    positions: ['top', 'center', 'bottom', 'left top', 'top left', 'left center', 'center left', 'left bottom', 'bottom left', 'right top', 'top right', 'right center', 'center right', 'right bottom', 'bottom right'], //> purpose of this arrays is to exclude developers mistakes. ex: ntp_background_alignment set to "middle" instead of "center" (https://chrome.google.com/webstore/detail/%D0%B1%D0%B5%D0%B3%D1%83%D1%89%D0%B0%D1%8F-%D0%BB%D0%B8%D1%81%D0%B8%D1%87%D0%BA%D0%B0/pcogoppjgcggbmflbmiihnbbdcbnbkjp)
    repeats: ['repeat', 'repeat-y', 'repeat-x', 'no-repeat'],
    sizes: ['dont_resize', 'fit_screen', 'fit_browser', 'cover_screen', 'cover_browser', 'stretch_screen', 'stretch_browser'],
};

export const mut = {
    uploading_theme_background: false,
};
