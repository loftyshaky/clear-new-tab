import { action, configure } from 'mobx';

import x from 'x';
import * as analytics from 'js/analytics';
import * as populate_storage_with_images_and_display_them from 'js/populate_storage_with_images_and_display_them';
import * as file_types from 'js/file_types';
import * as settings from 'options/settings';
import * as background_i from 'options/background_i';
import * as inputs_hiding from 'options/inputs_hiding';

configure({ enforceActions: 'observed' });

//> select image when clicking on it
export const select_background = async (clicked_background_id, e) => {
    try {
        const not_background_preview = !x.matches(e.target, '.background_preview');
        const not_delete_background_btn = !x.matches(x.closest(e.target, '.delete_background_btn'), '.delete_background_btn');
        const not_background_btn = !x.matches(e.target, '.background_btn');

        if (not_background_preview && not_delete_background_btn && not_background_btn) {
            analytics.send_options_backgrounds_event('selected');

            const clicked_background_page_i = background_i.get_background_i_by_id(clicked_background_id);
            const clicked_background_i = clicked_background_page_i + background_i.determine_background_i_modificator();
            change_selected_background(clicked_background_id, clicked_background_page_i);
            const ed_all = await eda();
            const background = await x.send_message_to_background_c({ message: 'get_background_obj_when_selecting_on_it', i: clicked_background_i });

            if (file_types.con.files[background.type] || file_types.con.types[background.type] === 'links') {
                settings.mut.storage_type = 'backgroundsd';

                settings.load_settings_inner('background_settings', background);
                settings.show_or_hide_global_options(true);
                settings.set_color_input_vizualization_color('background_settings', 'color', background.color === 'global' ? ed_all.color : background.color);
                settings.change_input_val('background_settings', 'settings_type', 'specific');

            } else if (file_types.con.types[background.type] === 'colors') {
                settings.mut.storage_type = 'ed';

                settings.load_settings_inner('background_settings', ed_all);
                settings.show_or_hide_global_options(false);
                settings.set_color_input_vizualization_color('background_settings', 'color', ed_all.color);
                settings.change_input_val('background_settings', 'settings_type', 'global');
            }

            settings.set_global_checkbox_val('color');
            settings.set_global_checkbox_val('video_volume');

            inputs_hiding.decide_what_inputs_to_hide();
        }

    } catch (er) {
        err(er, 117);
    }
};
//< select image when clicking on it

const change_selected_background = action((clicked_background_id, clicked_background_i) => {
    try {
        deselect_selected_background(false);

        mut.selected_background_id = clicked_background_id;
        populate_storage_with_images_and_display_them.ob.backgrounds[clicked_background_i].selected = true;

    } catch (er) {
        err(er, 118);
    }
});

export const deselect_selected_background = action(set_settings_type_to_global => {
    try {
        const selected_background_i = background_i.get_background_i_by_id(mut.selected_background_id);
        const background_exist = populate_storage_with_images_and_display_them.ob.backgrounds[selected_background_i]; // if not deleted selected image
        mut.selected_background_id = null;

        if (background_exist) {
            populate_storage_with_images_and_display_them.ob.backgrounds[selected_background_i].selected = false;
        }

        if (set_settings_type_to_global) {
            settings.change_input_val('background_settings', 'settings_type', 'global');
        }

    } catch (er) {
        err(er, 69);
    }
});

export const mut = {
    selected_background_id: null,
};
