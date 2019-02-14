'use_strict';

import * as r from 'ramda';

import x from 'x';
import { db } from 'js/init_db';
import * as theme_img from 'background/theme_img';
import * as multiple from 'background/multiple';
import * as tabs from 'background/tabs';
import * as file_types from 'js/file_types';

//> load_imgs (runs on extension enable)
export const load_imgs = async () => {
    try {
        const ed_all = await eda();

        await retrieve_imgs();

        if (ed_all.mode === 'theme' && what_browser === 'chrome') {
            const get_first_encountered_theme_img_theme_id = () => {
                const first_encountered_theme_img = mut.imgs.find(img => img.theme_id);
                const first_encountered_theme_img_theme_id = first_encountered_theme_img ? first_encountered_theme_img.theme_id : null;

                return first_encountered_theme_img_theme_id || null;
            };

            const installed_theme_id = await theme_img.get_installed_theme_id();
            const theme_id = installed_theme_id || get_first_encountered_theme_img_theme_id();

            if (theme_id) {
                await theme_img.get_theme_img(theme_id, false);
            }
        }

        if (mut.imgs.length > 0) {
            await preload_current_and_future_img('reload');
        }

        browser.tabs.query({ currentWindow: true, active: true }, async tabs_ => {
            if (tabs_.length > 0) {
                tabs.confirm_that_opened_tab_is_new_tab_page_and_that_it_is_not_in_preview_mode_and_store_id_if_true(tabs_[0].id); // get first opened new tab on browser start

                const ms_left = await multiple.get_ms_left();

                if (ed_all.change_interval == 1 || ms_left > 0) { // eslint-disable-line eqeqeq
                    x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'display_img_on_ext_enable' }]);
                }
            }
        });

    } catch (er) {
        err(er, 1, null, true);
    }
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
        err(er, 2, null, true);
    }
};
//< get ready image object for use in new tab

//> preload images
const preload_img = img_i => {
    try {
        if (mut.imgs.length > 0) {
            const img = r.clone(mut.imgs[img_i]);
            const not_color = img.type;

            if (not_color) {
                if (file_types.con.types[img.type] === 'files') {
                    img.img = URL.createObjectURL(img.img);
                }

                if (file_types.con.types[img.type] === 'links') {
                    new Image().src = img.img;
                }
            }

            return img;
        }

    } catch (er) {
        err(er, 3, null, true);
    }

    return undefined;
};

const remove_img_from_memory = async img => {
    try {
        if (img) {
            const img_is_file = file_types.con.types[img.type] === 'files';

            if (img_is_file) {
                await x.delay(10000);

                URL.revokeObjectURL(img.img);
            }
        }

    } catch (er) {
        err(er, 4, null, true);
    }
};

export const preload_current_and_future_img = async mode => {
    try {
        remove_img_from_memory(mut.current_img);

        const ed_all = await eda();

        if (mode === 'new_current_img' && mut.future_img) {
            mut.current_img = mut.imgs[ed_all.future_img] ? r.clone(mut).future_img : null;

        } else if (mode === 'reload') {
            remove_img_from_memory(mut.future_img);

            mut.current_img = mut.imgs[ed_all.current_img] ? preload_img(ed_all.current_img) : null;
        }

        mut.future_img = mut.imgs[ed_all.future_img] ? preload_img(ed_all.future_img) : null;

    } catch (er) {
        err(er, 5, null, true);
    }
};
//< preload images

export const mut = {
    imgs: [],
    current_img: null,
    future_img: null,
};
