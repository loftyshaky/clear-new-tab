'use_strict';

import * as r from 'ramda';

export const determine_theme_current_img = async (theme_id, imgs) => {
    try {
        const img_i = r.findIndex(
            r.propEq('theme_id', theme_id)
            || r.propEq('type', 'color_theme')
            || r.propEq('type', 'img_file_theme')
            || r.propEq('type', 'video_file_theme'),
            imgs,
        );

        if (img_i > -1) {
            return img_i;
        }

        return 0;

    } catch (er) {
        err(er, 168);
    }

    return undefined;
};
