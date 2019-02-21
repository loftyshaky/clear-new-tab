import * as enter_click from 'js/enter_click';
import * as settings from 'options/settings';

export const open_color_pickier_on_enter = e => {
    try {
        if (e.keyCode === enter_click.con.enter_key_code) {
            const color_input_vizualization = document.activeElement;
            const event = { target: color_input_vizualization };

            settings.show_or_hide_color_pickier_when_clicking_on_color_input_vizualization(event);
        }

    } catch (er) {
        err(er, 213);
    }
};
