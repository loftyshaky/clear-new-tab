import * as r from 'ramda';

export const determine_theme_current_background = async (theme_id, backgrounds) => {
    try {
        const background_i = r.findIndex(
            r.propEq('theme_id', theme_id)
            || r.propEq('type', 'color_theme')
            || r.propEq('type', 'img_file_theme')
            || r.propEq('type', 'video_file_theme'),
            backgrounds,
        );

        if (background_i > -1) {
            return background_i;
        }

        return 0;

    } catch (er) {
        err(er, 168);
    }

    return undefined;
};
