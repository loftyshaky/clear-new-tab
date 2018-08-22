//> determine_theme_current_img f

//^

'use strict';

import * as r from 'ramda';

//> determine_theme_current_img f
export const determine_theme_current_img = async (theme_id, imgs) => {
    try {
        const img_i = r.findIndex(r.propEq('theme_id', theme_id), imgs);

        if (img_i > - 1) {
            return img_i;

        } else {
            const img_i = r.findIndex(r.propEq('type', 'theme_file'), imgs);

            if (img_i > - 1) {
                return img_i;

            } else {
                return 0;
            }
        }

    } catch (er) {
        console.error(er);
    }
};
//< determine_theme_current_img f