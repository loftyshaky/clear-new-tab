//> set_default_settings f

//^

'use strict';

import db from 'js/init_db';
import * as shared_b_o from 'js/shared_b_o';

//> set_default_settings f
window.set_default_settings = async page => { // this function also called in options.js when clicking on "Restore Defaults" button
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
        change_interval: '3600000',
        mode: 'theme',
        current_random_color: shared_b_o.generate_random_color(),
        shuffle: true,
        slideshow: false,
        size: 'dont_resize',
        position: 'center center',
        repeat: 'no-repeat',
        color: '#ffffff'
    }

    if (page == 'background') {
        db.on("populate", function () {
            db.ed.add(ext_data_o);
        });

        db.open();

    } else if (page == 'options') {
        try {
            await db.transaction('rw', db.ed, () => {
                db.ed.put(ext_data_o);
            });

        } catch (er) {
            console.error(er);
        }
    }

}
//< set_default_settings f