import { action, configure } from 'mobx';

import x from 'x';
import * as shared_b_o from 'js/shared_b_o';
import * as shared_o from 'options/shared_o';
import * as settings from 'options/settings';

configure({ enforceActions: 'observed' });

//> select image when clicking on it
export const select_img = async (clicked_img_id, e) => {
    const clicked_img_i = shared_o.get_img_i_by_id(clicked_img_id);
    const not_img_preview = !x.matches(e.target, '.img_preview');
    const not_delete_img_btn = !x.matches(x.closest(e.target, '.delete_img_btn'), '.delete_img_btn');

    if (not_img_preview && not_delete_img_btn) {
        change_selected_img(clicked_img_id, clicked_img_i);

        try {
            const ed_all = await eda();
            const img = await x.send_message_to_background_c({ message: 'get_img_obj_when_selecting_on_it', i: clicked_img_i });

            if (img.type.indexOf('file') > -1 || img.type === 'link') {
                shared_o.mut.storage_type = 'imgs';

                settings.load_settings_inner('img_settings', img);
                shared_o.show_or_hide_global_options(true);
                shared_o.set_color_input_vizualization_color('img_settings', 'color', img.color === 'global' ? ed_all.color : img.color);
                shared_o.change_input_val('img_settings', 'settings_type', 'specific');

            } else if (img.type === 'color') {
                shared_o.mut.storage_type = 'ed';

                settings.load_settings_inner('img_settings', ed_all);
                shared_o.show_or_hide_global_options(false);
                shared_o.set_color_input_vizualization_color('img_settings', 'color', ed_all.color);
                shared_o.change_input_val('img_settings', 'settings_type', 'global');
            }

            shared_o.set_color_global_checkbox_val('color');

        } catch (er) {
            console.error(er);
        }
    }
};
//< select image when clicking on it

const change_selected_img = action((clicked_img_id, clicked_img_i) => {
    deselect_selected_img();

    shared_o.mut.selected_img_id = clicked_img_id;
    shared_b_o.ob.imgs[clicked_img_i].selected = true;
});

const deselect_selected_img = action(() => {
    const selected_img_i = shared_o.get_img_i_by_id(shared_o.mut.selected_img_id);
    const img_exist = shared_b_o.ob.imgs[selected_img_i]; // if not deleted selected image

    if (img_exist) {
        shared_b_o.ob.imgs[selected_img_i].selected = false;
    }
});
