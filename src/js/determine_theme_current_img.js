//> determine_theme_current_img f

//^

import * as r from 'ramda';

//> determine_theme_current_img f
export const determine_theme_current_img = async (theme_id, imgs) => {
    try {
        const img_i = r.findIndex(r.propEq('theme_id', theme_id), imgs);

        if (img_i > -1) {
            return img_i;

        }

        const img_i_2 = r.findIndex(r.propEq('type', 'theme_file'), imgs);

        if (img_i_2 > -1) {
            return img_i_2;

        }

        return 0;

    } catch (er) {
        console.error(er);
    }

    return undefined;
};
//< determine_theme_current_img f
