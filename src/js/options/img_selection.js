//> select image when clicking on it t

//> change_selected_img f

//> deselect_selected_img f

//^

'use strict';

import x from 'x';
import * as shared_o from 'options/shared_o';

import { action, configure } from "mobx";

configure({ enforceActions: true });

//> select image when clicking on it t
export const select_img = async (clicked_img_id, e) => {
    const clicked_img_i = shared_o.get_img_i_by_id(clicked_img_id);
    const not_img_preview = !x.matches(e.target, '.img_preview');
    const not_delete_img_btn = !x.matches(x.closest(e.target, '.delete_img_btn'), '.delete_img_btn');

    if (not_img_preview && not_delete_img_btn) {
        change_selected_img(clicked_img_id, clicked_img_i);

        try {
            const img = await x.send_message_to_background_c({ message: "get_img_obj_when_selecting_on_it", i: clicked_img_i });

            if (img.type.indexOf('file') > - 1 || img.type == 'link') {
                shared_o.mut.storage_type = 'imgs';

                shared_o.set_selects_text('img', img);
                shared_o.show_or_hide_global_options(true);

                shared_o.set_color_input_vizualization_color('color', img.color == 'global' ? ed.color : img.color);

            } else if (img.type == 'color') {
                shared_o.mut.storage_type = 'ed';

                shared_o.set_selects_text('ed', ed);
                shared_o.show_or_hide_global_options(false);

                shared_o.set_color_input_vizualization_color('color', ed.color);
            }

            shared_o.set_color_global_checkbox_val();

        } catch (er) {
            console.error(er);
        }
    }
};
//< select image when clicking on it t

//> change_selected_img f
const change_selected_img = action((clicked_img_id, clicked_img_i) => {
    deselect_selected_img();

    shared_o.mut.selected_img_id = clicked_img_id;
    shared_o.ob.imgs[clicked_img_i].selected = true;
});
//< change_selected_img f

//> deselect_selected_img f
const deselect_selected_img = action(() => {
    const selected_img_i = shared_o.get_img_i_by_id(shared_o.mut.selected_img_id);
    const img_exist = shared_o.ob.imgs[selected_img_i]; // if not deleted selected image

    if (img_exist) {
        shared_o.ob.imgs[selected_img_i].selected = false;
    }
});
//< deselect_selected_img f