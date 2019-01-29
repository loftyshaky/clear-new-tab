import * as r from 'ramda';

import x from 'x';
import { db } from 'js/init_db';
import * as theme_img from 'background/theme_img';
import * as multiple from 'background/multiple';
import * as tabs from 'background/tabs';

//> load_imgs (runs on extension enable)
export const load_imgs = async () => {
    const ed_all = await eda();
    await retrieve_imgs();

    if (ed_all.mode === 'theme' && what_browser === 'chrome') {
        const get_first_encountered_theme_img_theme_id = () => {
            const first_encountered_theme_img = mut.imgs.find(img => img.theme_id);
            const first_encountered_theme_img_theme_id = first_encountered_theme_img ? first_encountered_theme_img.theme_id : null;

            return first_encountered_theme_img_theme_id || null;
        };

        const installed_theme_id = await get_installed_theme_id();
        const theme_id = installed_theme_id || get_first_encountered_theme_img_theme_id();

        if (theme_id) {
            await theme_img.get_theme_img(theme_id, false);
        }
    }

    if (mut.imgs.length > 0) {
        await preload_current_and_future_img('reload');
    }

    browser.tabs.query({ currentWindow: true, active: true }, async tabs_ => {
        tabs.confirm_that_opened_tab_is_new_tab_page_and_that_it_is_not_in_preview_mode_and_store_id_if_true(tabs_[0].id); // get first opened new tab on browser start

        const ms_left = await multiple.get_ms_left();

        if (ed_all.change_interval == 1 || ms_left > 0) { // eslint-disable-line eqeqeq
            x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'display_img_on_ext_enable' }]);
        }
    });
};
//< load_imgs (runs on extension enable)

//> get ready image object for use in new tab
export const retrieve_imgs = async send_response => {
    try {
        mut.imgs = await db.imgs.orderBy('position_id').toArray();

        if (send_response) {
            send_response();
        }

    } catch (er) {
        console.error(er);
    }
};
//< get ready image object for use in new tab

//> preload images
const preload_img = img_i => {
    if (mut.imgs.length !== 0) {
        const img = r.clone(mut.imgs[img_i]);
        const not_color = img.type;

        if (not_color) {
            if (img.type.indexOf('file') > -1) {
                img.img = URL.createObjectURL(img.img);
            }

            if (img.type.indexOf('link') > -1) {
                new Image().src = img.img;
            }
        }

        return img;
    }

    return undefined;
};

const remove_img_from_memory = async img => {
    if (img && img.type.indexOf('file') > -1) {
        await x.delay(10000);

        URL.revokeObjectURL(img.img);
    }
};

export const preload_current_and_future_img = async mode => {
    remove_img_from_memory(mut.current_img);

    const ed_all = await eda();

    if (mode === 'new_current_img' && mut.future_img) {
        mut.current_img = mut.imgs[ed_all.future_img] ? r.clone(mut).future_img : null;

    } else if (mode === 'reload') {
        remove_img_from_memory(mut.future_img);

        mut.current_img = mut.imgs[ed_all.current_img] ? preload_img(ed_all.current_img) : null;
    }

    mut.future_img = mut.imgs[ed_all.future_img] ? preload_img(ed_all.future_img) : null;
};
//< preload images

export const get_installed_theme_id = () => new Promise(resolve => {
    browser.management.getAll(async all_apps => {
        const last_installed_theme_theme_id = await ed('last_installed_theme_theme_id');
        const enabled_themes_without_last_installed = all_apps.filter(app => app.type === 'theme' && app.enabled === true && app.id !== last_installed_theme_theme_id);
        const themes = enabled_themes_without_last_installed.length === 0 ? all_apps.filter(app => app.type === 'theme' && app.enabled === true) : enabled_themes_without_last_installed;
        const theme_id = themes.length > 0 ? themes[0].id : null;

        resolve(theme_id);
    });
});

export const mut = {
    imgs: [],
    current_img: null,
    future_img: null,
};
