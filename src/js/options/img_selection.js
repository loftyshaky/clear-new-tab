'use_strict';

import { action, configure } from 'mobx';

import x from 'x';
import * as populate_storage_with_images_and_display_them from 'js/populate_storage_with_images_and_display_them';
import * as settings from 'options/settings';
import * as img_i from 'options/img_i';

configure({ enforceActions: 'observed' });

//> select image when clicking on it
export const select_img = async (clicked_img_id, e) => {
    try {
        const not_img_preview = !x.matches(e.target, '.img_preview');
        const not_delete_img_btn = !x.matches(x.closest(e.target, '.delete_img_btn'), '.delete_img_btn');
        const not_img_btn = !x.matches(e.target, '.img_btn');

        if (not_img_preview && not_delete_img_btn && not_img_btn) {
            const clicked_img_page_i = img_i.get_img_i_by_id(clicked_img_id);
            const clicked_img_i = clicked_img_page_i + img_i.determine_img_i_modificator();
            change_selected_img(clicked_img_id, clicked_img_page_i);
            const ed_all = await eda();
            const img = await x.send_message_to_background_c({ message: 'get_img_obj_when_selecting_on_it', i: clicked_img_i });

            if (img.type.indexOf('file') > -1 || img.type === 'link') {
                settings.mut.storage_type = 'imgs';

                settings.load_settings_inner('img_settings', img);
                settings.show_or_hide_global_options(true);
                settings.set_color_input_vizualization_color('img_settings', 'color', img.color === 'global' ? ed_all.color : img.color);
                settings.change_input_val('img_settings', 'settings_type', 'specific');

            } else if (img.type === 'color') {
                settings.mut.storage_type = 'ed';

                settings.load_settings_inner('img_settings', ed_all);
                settings.show_or_hide_global_options(false);
                settings.set_color_input_vizualization_color('img_settings', 'color', ed_all.color);
                settings.change_input_val('img_settings', 'settings_type', 'global');
            }

            settings.set_color_global_checkbox_val('color');
        }

    } catch (er) {
        err(er, 117);
    }
};
//< select image when clicking on it

const change_selected_img = action((clicked_img_id, clicked_img_i) => {
    try {
        deselect_selected_img(false);

        mut.selected_img_id = clicked_img_id;
        populate_storage_with_images_and_display_them.ob.imgs[clicked_img_i].selected = true;

    } catch (er) {
        err(er, 118);
    }
});

export const deselect_selected_img = action(set_settings_type_to_global => {
    try {
        const selected_img_i = img_i.get_img_i_by_id(mut.selected_img_id);
        const img_exist = populate_storage_with_images_and_display_them.ob.imgs[selected_img_i]; // if not deleted selected image

        if (img_exist) {
            populate_storage_with_images_and_display_them.ob.imgs[selected_img_i].selected = false;
        }

        if (set_settings_type_to_global) {
            settings.change_input_val('img_settings', 'settings_type', 'global');
        }

    } catch (er) {
        err(er, 69);
    }
});

export const mut = {
    selected_img_id: 1,
};
