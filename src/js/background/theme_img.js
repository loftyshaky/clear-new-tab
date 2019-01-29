import * as r from 'ramda';
import jszip from 'jszip';
import jszip_utils from 'jszip-utils';

import x from 'x';
import { db } from 'js/init_db';
import * as shared_b from 'background/shared_b';
import * as shared_b_o from 'js/shared_b_o';
import * as populate_storage_with_images_and_display_them from 'js/populate_storage_with_images_and_display_them';
import * as determine_theme_current_img from 'js/determine_theme_current_img';

//> download theme crx, unpack it, access theme data from theme crx manifest, download theme image
export const get_theme_img = async (theme_id, reinstall_even_if_theme_img_already_exist, tab_id) => {
    const ed_all = await eda();

    if (ed_all.mode === 'theme') {
        try {
            const installing_theme_img_already_exist = r.find(r.propEq('theme_id', theme_id), shared_b.mut.imgs);
            let new_current_img;

            if ((!ed_all.keep_old_themes_imgs && reinstall_even_if_theme_img_already_exist) || !installing_theme_img_already_exist) {
                const theme_package = await new jszip.external.Promise((resolve, reject) => {
                    jszip_utils.getBinaryContent(`https://clients2.google.com/service/update2/crx?response=redirect&x=id%3D${theme_id}%26uc&prodversion=32`, (err, theme_package_) => {
                        if (err) {
                            reject(err);

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
                const position = positions.indexOf(position_prop) > -1 ? positions_dict[position_prop] : 'center center';
                const repeat = repeats.indexOf(repeat_prop) > -1 ? repeat_prop : 'no-repeat';
                const color_rgb = r.path(['colors', 'ntp_background'], theme_obj);
                const color = color_rgb ? `#${rgb_to_hex(color_rgb)}` : '#ffffff';
                const theme_img_info = {
                    position,
                    repeat,
                    color,
                };

                const is_valid_img = img_name ? img_name_ => valid_file_types.some(ext => img_name_.includes(ext)) : null;

                if (is_valid_img && !is_valid_img(img_name) && what_browser !== 'chrome') {
                    throw 'Image is not valid image'; // eslint-disable-line no-throw-literal
                }

                await delete_previous_themes_imgs();

                await r.ifElse(
                    () => img_name,

                    async () => {
                        let file = await theme_package_data.file(img_name); // download theme image
                        file = file || await theme_package_data.file(img_name.charAt(0).toUpperCase() + img_name.slice(1)); // download theme image (convert first letter of image name to uppercase)
                        const img = await file.async('blob');

                        return populate_storage_with_images_and_display_them.populate_storage_with_images('file', 'resolved', [img], theme_img_info, theme_id);
                    },

                    async () => populate_storage_with_images_and_display_them.populate_storage_with_images('color', 'resolved', [color], null, theme_id),
                )();

                await db.ed.update(1, { last_installed_theme_theme_id: theme_id });
                await shared_b.retrieve_imgs();

                new_current_img = await determine_theme_current_img.determine_theme_current_img(theme_id, shared_b.mut.imgs);

                x.iterate_all_tabs(x.send_message_to_tab, [{
                    message: 'load_last_page',
                }]);

            } else { // when undoing theme
                const last_installed_theme_theme_id = what_browser === 'chrome' ? await shared_b.get_installed_theme_id() : theme_id;

                await db.ed.update(1, { last_installed_theme_theme_id });

                new_current_img = await determine_theme_current_img.determine_theme_current_img(last_installed_theme_theme_id, shared_b.mut.imgs);
            }

            await db.ed.update(1, { current_img: new_current_img });
            await shared_b_o.get_new_future_img(new_current_img + 1);
            await x.get_ed();
            shared_b.preload_current_and_future_img('reload');

            x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'change_current_img_input_val' }]);
            x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'reload_img' }]);

            return 'success';

        } catch (er) {
            console.error(er);

            if (what_browser !== 'chrome') {
                await x.send_message_to_tab_c(tab_id, { message: 'notify_about_paid_theme_error' });
            }

            return 'error';
        }

    } else if (what_browser !== 'chrome') {
        await x.send_message_to_tab_c(tab_id, { message: 'notify_about_wrong_mode' });
    }

    return undefined;
};
//< download theme crx, unpack it, access theme data from theme crx manifest, download theme image

const delete_previous_themes_imgs = async () => {
    try {
        const ed_all = await eda();

        if (ed_all.mode === 'theme' && await !ed_all.keep_old_themes_imgs) {
            const theme_imgs = shared_b.mut.imgs.filter(img => img.theme_id);
            const at_least_one_theme_image_found = theme_imgs[0];

            if (at_least_one_theme_image_found) {
                const ids_of_theme_imgs_to_delete_final = theme_imgs.map(img => img.id);

                await db.transaction('rw', db.imgs, async () => db.imgs.bulkDelete(ids_of_theme_imgs_to_delete_final));
            }
        }

    } catch (er) {
        console.error(er);
    }

    return [];
};

const rgb_to_hex = r.pipe(r.map(val => val.toString(16).padStart(2, '0')), r.join(''));

//> on theme installiation
if (what_browser === 'chrome') {
    browser.management.onEnabled.addListener(ext_info => {
        if (ext_info.type === 'theme') {
            get_theme_img(ext_info.id, true);
        }
    });
}
//< on theme installiation

const positions_dict = {
    top: 'center top',
    center: 'center center',
    bottom: 'center bottom',
    'left top': 'left top',
    'top left': 'left top',
    'left center': 'left center',
    'center left': 'left center',
    'left bottom': 'left bottom',
    'bottom left': 'left bottom',
    'right top': 'right top',
    'top right': 'right top',
    'right center': 'right center',
    'center right': 'right center',
    'right bottom': 'right bottom',
    'bottom right': 'right bottom',
};

const valid_file_types = ['.gif', '.jpeg', '.jpg', '.png'];
//>1 purpose of this arrays is to exclude developers mistakes. ex: ntp_background_alignment set to "middle" instead of "center" (https://chrome.google.com/webstore/detail/%D0%B1%D0%B5%D0%B3%D1%83%D1%89%D0%B0%D1%8F-%D0%BB%D0%B8%D1%81%D0%B8%D1%87%D0%BA%D0%B0/pcogoppjgcggbmflbmiihnbbdcbnbkjp)
const positions = ['top', 'center', 'bottom', 'left top', 'top left', 'left center', 'center left', 'left bottom', 'bottom left', 'right top', 'top right', 'right center', 'center right', 'right bottom', 'bottom right'];
const repeats = ['repeat', 'repeat-y', 'repeat-x', 'no-repeat'];
//>1 purpose of this arrays is to exclude developers mistakes. ex: ntp_background_alignment set to "middle" instead of "center" (https://chrome.google.com/webstore/detail/%D0%B1%D0%B5%D0%B3%D1%83%D1%89%D0%B0%D1%8F-%D0%BB%D0%B8%D1%81%D0%B8%D1%87%D0%BA%D0%B0/pcogoppjgcggbmflbmiihnbbdcbnbkjp)
