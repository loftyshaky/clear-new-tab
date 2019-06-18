import * as r from 'ramda';

import x from 'x';
import { db } from 'js/init_db';
import * as file_types from 'js/file_types';
import * as theme_background from 'background/theme_background';
import * as tabs from 'background/tabs';

//> load_backgrounds (runs on extension enable)
export const load_backgrounds = async () => {
    try {
        const ed_all = await eda();

        await retrieve_backgrounds();

        if (ed_all.mode === 'theme' && what_browser === 'chrome') {
            const get_first_encountered_theme_background_theme_id = () => {
                const first_encountered_theme_background = mut.backgrounds.find(background => background.theme_id);
                const first_encountered_theme_background_theme_id = first_encountered_theme_background ? first_encountered_theme_background.theme_id : null;

                return first_encountered_theme_background_theme_id || null;
            };

            const installed_theme_id = await theme_background.get_installed_theme_id();
            const theme_id = installed_theme_id || get_first_encountered_theme_background_theme_id();

            if (theme_id) {
                await theme_background.get_theme_background(theme_id, false, null, true);
            }
        }

        if (!mut.preload_current_and_future_background_f_is_running) {
            await preload_current_and_future_background('reload');
        }

        browser.tabs.query({ currentWindow: true, active: true }, async tabs_ => {
            if (tabs_.length > 0) {
                tabs.confirm_that_opened_tab_is_new_tab_page_and_that_it_is_not_in_preview_mode_and_store_id_if_true(tabs_[0].id); // get first opened new tab on browser start
            }
        });

    } catch (er) {
        err(er, 1, null, true);
    }
};
//< load_backgrounds (runs on extension enable)

//> get ready image object for use in new tab
export const retrieve_backgrounds = async send_response => {
    try {
        mut.backgrounds = [];

        await db.backgroundsd.orderBy('position_id').each(row => {
            try {
                mut.backgrounds.push(row);

            } catch (er) {
                err(er, 325);
            }
        });

        mut.imgs_retrieved = true;

        if (send_response) {
            send_response();
        }

    } catch (er) {
        err(er, 2, null, true);
    }
};
//< get ready image object for use in new tab

//> preload images
const preload_background = async background_i => {
    try {
        if (mut.backgrounds.length > 0) {
            const background_obj = r.clone(mut.backgrounds[background_i]);
            const not_color = background_obj.type;

            if (not_color) {
                const background = await db.backgrounds.get(background_obj.id);

                if (file_types.con.files[background_obj.type]) {
                    background_obj.background = URL.createObjectURL(background.background);

                } else if (file_types.con.types[background_obj.type] === 'links') {
                    new window.Image().src = background.background;

                    background_obj.background = background.background;

                } else if (file_types.con.types[background_obj.type] === 'colors') {
                    background_obj.background = background.background;
                }
            }

            return background_obj;
        }

    } catch (er) {
        err(er, 3, null, true);
    }

    return undefined;
};

const remove_background_from_memory = async background => {
    try {
        if (background) {
            const background_is_file = file_types.con.files[background.type];

            if (background_is_file) {
                await x.delay(10000);

                URL.revokeObjectURL(background.background);
            }
        }

    } catch (er) {
        err(er, 4, null, true);
    }
};

export const preload_current_and_future_background = async mode => {
    try {
        mut.preload_current_and_future_background_f_is_running = true;
        remove_background_from_memory(mut.current_background);

        const ed_all = await eda();

        await preload_current_and_future_background_inner(mode, ed_all);

    } catch (er) {
        err(er, 5, null, true);
    }
};

const preload_current_and_future_background_inner = async (mode, ed_all) => {
    if (mut.imgs_retrieved) {
        if (mode === 'new_current_background' && mut.future_background) {
            mut.current_background = mut.backgrounds[ed_all.future_background] ? r.clone(mut).future_background : null;

        } else if (mode === 'reload') {
            remove_background_from_memory(mut.future_background);

            mut.current_background = mut.backgrounds[ed_all.current_background] ? await preload_background(ed_all.current_background) : null;
        }

        mut.future_background = mut.backgrounds[ed_all.future_background] ? await preload_background(ed_all.future_background) : null;

        mut.preload_current_and_future_background_f_is_running = false;

    } else {
        await x.delay(100);

        await preload_current_and_future_background_inner(mode, ed_all);
    }
};
//< preload images

export const mut = {
    backgrounds: [],
    preload_current_and_future_background_f_is_running: false,
    current_background: null,
    future_background: null,
    imgs_retrieved: false,
};
