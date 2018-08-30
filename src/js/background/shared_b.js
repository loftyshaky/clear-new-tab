//> load_imgs (runs on extension enable) t

//> get ready image object for use in new tab t

//> preload images t

//> update_time_setting f

//> get_installed_theme_id f

//> get number of ms left till change interval elpse (may be negative) t

//> varibles t

//^

'use strict';

import x from 'x';
import db from 'js/init_db';
import * as theme_img from 'background/theme_img';

import * as r from 'ramda';

//> load_imgs (runs on extension enable) t
export const load_imgs = async () => {
    if (ed) {
        await retrieve_imgs();

        const at_least_one_theme_img_exist = mut.imgs.some(img => img.theme_id);
        
        if (ed.mode == 'theme' && what_browser == 'chrome' && at_least_one_theme_img_exist) {
            const get_first_encountered_theme_img_theme_id = () => {
                const first_encountered_theme_img_theme_id = mut.imgs.find(img => img.theme_id).theme_id;

                return first_encountered_theme_img_theme_id ? first_encountered_theme_img_theme_id : null;
            };

            const installed_theme_id = await get_installed_theme_id();
            const theme_id = !installed_theme_id ? installed_theme_id : get_first_encountered_theme_img_theme_id();

            if (theme_id) {
                await theme_img.get_theme_img(theme_id, false);
            }
        }

        if (mut.imgs.length > 0) {
            preload_current_and_future_img('reload');
        }

        x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'display_img_on_ext_enable' }]);
    }
};
//< load_imgs (runs on extension enable) t

//> get ready image object for use in new tab t
export const retrieve_imgs = async send_response => {
    try {
        mut.imgs = await db.imgs.orderBy('position_id').toArray();

        if (send_response) {
            send_response();
        }

    } catch (er) {
        console.error(er);
    }
}
//< get ready image object for use in new tab t

//> preload images t
const preload_img = img_i => {
    if (mut.imgs.length != 0) {
        const img = r.clone(mut.imgs[img_i]);
        const not_color = img.type;

        if (not_color) {
            if (img.type.indexOf('file') > - 1) {
                img.img = URL.createObjectURL(img.img);
            }

            if (img.type.indexOf('link') > - 1) {
                new Image().src = img.img;
            }
        }

        return img;
    }
}

const remove_img_from_memory = async img => {
    if (img && img.type.indexOf('file') > - 1) {
        await x.delay(10000);

        URL.revokeObjectURL(img.img);
    }
}

export const preload_current_and_future_img = (mode) => {
    remove_img_from_memory(mut.current_img);

    if (mode == 'new_current_img' && mut.future_img) {
        mut.current_img = mut.imgs[ed.future_img] ? r.clone(mut).future_img : null;

    } else if (mode == 'reload') {
        remove_img_from_memory(mut.future_img);

        mut.current_img = mut.imgs[ed.current_img] ? preload_img(ed.current_img) : null;
    }

    mut.future_img = mut.imgs[ed.future_img] ? preload_img(ed.future_img) : null;
}
//< preload images t

//> get_installed_theme_id f
export const get_installed_theme_id = () => {
    return new Promise((resolve) => {
        browser.management.getAll(all_apps => {
            const enabled_themes_without_last_installed = all_apps.filter(app => app.type == 'theme' && app.enabled == true && app.id != ed.last_installed_theme_theme_id);
            const themes = enabled_themes_without_last_installed.length == 0 ? all_apps.filter(app => app.type == 'theme' && app.enabled == true) : enabled_themes_without_last_installed;
            const theme_id = themes.length > 0 ? themes[0].id : null;

            resolve(theme_id);
        });
    });
};
//< get_installed_theme_id f

//> get number of ms left till change interval elpse (may be negative) t
export const get_ms_left = props => {
    const time = new Date().getTime();
    const ms_left = ed.change_interval - (time - ed.last_img_change_time);

    return ms_left;
};
//< get number of ms left till change interval elpse (may be negative) t

//> varibles t
export const mut = {
    imgs: null,
    current_img: null,
    future_img: null
};
//< varibles t