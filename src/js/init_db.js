/* eslint-disable no-param-reassign */

import Dexie from 'dexie';

export let db; // eslint-disable-line import/no-mutable-exports

export const products = { // when adding product in this array you need to also add: license_key to inputs_data.js or for selects select_options.js; default to inputs_data.js;
    all: false,
    theme_beta: false,
    bookmarks_bar: false,
    random_solid_color: false,
    slideshow: false,
    slide: false,
    paste_btn: false,
};

export const init_db = () => {
    try {
        db = new Dexie('Clear New Tab');

        db.version(1).stores({
            ed: 'id',
            imgs: 'id, position_id',
        });

        db.version(2).stores({ // old users still keep empty imgs table, need to delete it later
            ed: 'id',
            backgrounds: 'id',
            backgroundsd: 'id, position_id',
        }).upgrade(async tx => {
            tx.ed.toCollection().modify(ed => {
                ed.current_background = ed.current_img;
                ed.future_background = ed.future_img;
                ed.keep_old_themes_backgrounds = ed.keep_old_themes_imgs;
                ed.last_background_change_time = ed.last_img_change_time;
                ed.show_bookmarks_bar = false;
                ed.enable_paste = false;
                ed.allow_downloading_imgs_by_link = false;
                ed.set_last_uploaded = false;
                ed.background_already_changed = true;
                ed.video_volume = 0;
                ed.show_link_to_default_new_tab = false;
                ed.background_change_effect = 'crossfade';
                ed.slide_direction = 'from_right_to_left';
                ed.position = con.positions_dict[ed.position];
                ed.allow_analytics = false;
                ed.answered_to_analytics_privacy_question = false;
                delete ed.current_img;
                delete ed.future_img;
                delete ed.keep_old_themes_imgs;
                delete ed.last_img_change_time;
                delete ed.use_theme_img;
            });

            const imgs = await tx.imgs.toArray();
            await db.backgroundsd.bulkAdd(imgs);

            await tx.imgs.toCollection().modify(img => {
                img.background = img.img;
                delete img.img;
                delete img.color;
                delete img.position;
                delete img.position_id;
                delete img.repeat;
                delete img.size;
                delete img.theme_id;
                delete img.type;
            });

            const imgs_updated = await tx.imgs.toArray();
            await db.backgrounds.bulkAdd(imgs_updated);

            tx.backgroundsd.toCollection().modify(background => {
                const background_is_color = background.type === 'color' || background.type === 'theme_color';

                if (!background_is_color) {
                    background.position = con.positions_dict[background.position];
                    background.video_volume = 'global';
                }

                background.type = con.types[background.type];
                delete background.img;
            });

            db.imgs.clear();
        });

        db.version(3).stores({ // old users still keep empty imgs table, need to delete it later
            ed: 'id',
        }).upgrade(async tx => {
            tx.ed.toCollection().modify(ed => {
                ed.get_theme_background_f_run_once = true;
                ed.last_installed_theme_beta_theme_id = '';
                ed.previously_installed_theme_beta_theme_id = '';
            });
        });

        db.version(4).stores({
            ed: 'id',
        }).upgrade(async tx => {
            tx.ed.toCollection().modify(ed => {
                ed.products = products;
            });
        });

    } catch (er) {
        err(er, 171);
    }
};

const con = {
    positions_dict: {
        global: 'global',
        'top center': '50% 0%',
        'center center': '50% 50%',
        'bottom center': '50% 100%',
        'top left': '0% 0%',
        'center left': '0% 50%',
        'bottom left': '0% 100%',
        'top right': '100% 0%',
        'center right': '100% 50%',
        'bottom right': '100% 100%',
    },
    types: {
        color: 'color',
        theme_color: 'color_theme',
        link: 'img_link',
        file: 'img_file',
        theme_file: 'img_file_theme',
    },
};

init_db();
