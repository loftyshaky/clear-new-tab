/* eslint-disable no-param-reassign */

import Dexie from 'dexie';

export let db; // eslint-disable-line import/no-mutable-exports

export const init_db = () => {
    try {
        db = new Dexie('Clear New Tab');

        db.version(1).stores({
            ed: 'id',
            imgs: 'id, position_id',
        });

        db.version(2).stores({
            ed: 'id',
            imgs: 'id',
            imgsd: 'id, position_id',
        }).upgrade(async tx => {
            const imgs = await tx.imgs.toArray();
            await db.imgsd.bulkAdd(imgs);

            tx.imgs.toCollection().modify(img => {
                delete img.color;
                delete img.position;
                delete img.position_id;
                delete img.repeat;
                delete img.size;
                delete img.theme_id;
                delete img.type;
            });

            tx.imgsd.toCollection().modify(img => {
                const img_is_color = img.type === 'color' || img.type === 'theme_color';

                if (!img_is_color) {
                    img.position = con.positions_dict[img.position];
                    img.video_volume = 'global';
                }

                img.type = con.types[img.type];
                delete img.img;
            });

            tx.ed.toCollection().modify(ed => {
                ed.set_last_uploaded = false;
                ed.img_already_changed = true;
                ed.video_volume = 0;
                ed.show_link_to_default_new_tab = false;
                ed.img_change_effect = 'crossfade';
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
