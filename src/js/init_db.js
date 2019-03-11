/* eslint-disable no-param-reassign */

import Dexie from 'dexie';

export let db; // eslint-disable-line import/no-mutable-exports

export const init_db = () => {
    try {
        db = new Dexie('Clear New Tab');

        db.version(1).stores({
            ed: 'id',
            backgrounds: 'id, position_id',
        });

        db.version(2).stores({
            ed: 'id',
            backgrounds: 'id',
            backgroundsd: 'id, position_id',
        }).upgrade(async tx => {
            const backgrounds = await tx.backgrounds.toArray();
            await db.backgroundsd.bulkAdd(backgrounds);

            tx.backgrounds.toCollection().modify(background => {
                delete background.color;
                delete background.position;
                delete background.position_id;
                delete background.repeat;
                delete background.size;
                delete background.theme_id;
                delete background.type;
            });

            tx.backgroundsd.toCollection().modify(background => {
                const background_is_color = background.type === 'color' || background.type === 'theme_color';

                if (!background_is_color) {
                    background.position = con.positions_dict[background.position];
                    background.video_volume = 'global';
                }

                background.type = con.types[background.type];
                delete background.background;
            });

            tx.ed.toCollection().modify(ed => {
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
