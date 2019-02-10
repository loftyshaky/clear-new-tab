'use_strict';

import { db, init_db } from 'js/init_db';
import * as generate_random_color from 'js/generate_random_color';

window.set_default_settings = async page => { // this function also called in options.js when clicking on "Restore global defaults" button
    try {
        const ext_data_o = {
            id: 1,
            show_install_help: true,
            last_installed_theme_theme_id: '',
            download_img_when_link_given: false,
            current_img: 0,
            future_img: 1,
            last_img_change_time: 0,
            use_theme_img: true,
            keep_old_themes_imgs: false,
            set_last_uploaded: false,
            change_interval: '3600000',
            img_already_changed: true,
            mode: 'theme',
            current_random_color: generate_random_color.generate_random_color(),
            shuffle: true,
            slideshow: false,
            size: 'dont_resize',
            position: 'center center',
            repeat: 'no-repeat',
            color: '#ffffff',
        };

        if (page === 'background') {
            db.on('populate', () => {
                try {
                    db.ed.add(ext_data_o);

                } catch (er) {
                    err(er, 37, null, true);
                }
            });

            db.open();

        } else if (page === 'options') {
            try {
                init_db();

                await db.transaction('rw', db.ed, async () => {
                    try {
                        ext_data_o.show_install_help = await ed('show_install_help');

                        db.ed.put(ext_data_o);

                    } catch (er) {
                        err(er, 36, null, true);
                    }
                });

            } catch (er) {
                err(er, 35, null, true);
            }
        }

    } catch (er) {
        err(er, 34, null, true);
    }
};
