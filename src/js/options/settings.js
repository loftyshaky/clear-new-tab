//> change_settings f

//> color input t

//>1 change color setting t

//>1 change_color_global_checkbox_setting f

//>1 show_or_hide_color_pickier_when_clicking_on_color_input_vizualization f

//>2 try to hide color pickier when clicking outside of color pickier t

//>2 try to show color pickier when clicking on color_input_vizualization t

//>1 show_or_hide_color_pickier f

//>1 set_color_color_pickier_position f

//> selects text t

//>1 change option value when selecting option; hide / show global options / background color 'Global' checkbox when selecting img / 'Global' option in settings type input t

//>1 change option value when selecting option; hide / show global options / background color 'Global' checkbox when selecting img / 'Global' option in settings type input t

//>1 get selects text on page load, all images deletion or image selection t

//>1 get selects text on page load, all images deletion or image selection t

//> current_img input t

//>1 change_current_img_by_typing_into_currrent_img_input f

//>1 change_current_img_by_clicking_on_select_img_btn f

//>1 change_current_img_insert_in_db f

//>1 correct current image input value when defocusing correct image input t

//> restore_default_global_settings f

//> varibles t

//^

'use strict';

import x from 'x';
import db from 'js/init_db';
import * as shared_o from 'options/shared_o';
import { selects_options } from 'options/selects_options';
import * as shared_b_o from 'js/shared_b_o';

import { observable, action, configure } from "mobx";
import * as r from 'ramda';

configure({ enforceActions: true });

//> change_settings f
export const change_settings = async (input_type, storage, val) => {
    try {
        const global_and_specefic_storages = ['size', 'position', 'repeat', 'color'];
        const storage_type = global_and_specefic_storages.indexOf(storage) > - 1 ? shared_o.mut.storage_type : 'ed';
        const storage_id = storage_type == 'ed' ? 1 : shared_o.mut.selected_img_id;
        const settings_obj = await db[storage_type].get(storage_id);
        const old_val = settings_obj[storage];
        let new_val;

        if (input_type == 'checkbox') {
            new_val = !old_val;

        } else if (input_type == 'select' || input_type == 'color') {
            new_val = val;
        }

        if (storage == 'change_interval') {
            await x.send_message_to_background_c({ message: 'clear_change_img_timer' });
            await x.send_message_to_background({ message: 'update_time_setting_and_start_timer' });
        }

        if (input_type == 'select' && val == 'theme') {
            const new_current_img = await x.send_message_to_background_c({ message: 'get_new_current_img_when_choosing_theme_mode' });

            await db.ed.update(1, { current_img: new_current_img });
            shared_o.change_current_img_input_val(new_current_img + 1);
            await shared_b_o.get_new_future_img(new_current_img + 1);
        }

        await db[storage_type].update(storage_id, { [storage]: new_val });

        await x.send_message_to_background_c({ message: "reload_ed" });
        await x.get_ed();
        shared_o.decide_what_input_items_to_hide();
        x.send_message_to_background({ message: "update_imgs_obj", id: storage_id, storage: storage, val: new_val });

        if (input_type == 'select' && val == 'theme' && what_browser == 'chrome') {
            await x.send_message_to_background_c({ message: 'get_theme_img', reinstall_even_if_theme_img_already_exist: false });
        }

        x.send_message_to_background({ message: 'preload_img' });

        if (input_type == 'color') {
            shared_o.mut.current_color_pickier.el = null;

            shared_o.set_color_input_vizualization_color('color', new_val);

            if (storage_type == 'imgs') {
                await db.imgs.update(storage_id, { global: false });
                x.send_message_to_background({ message: "update_imgs_obj", id: storage_id, storage: 'global', val: false });
                shared_o.set_color_global_checkbox_val();
            }
        }

        x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'reload_img' }]);

    } catch (er) {
        console.error(er);
    }
};
//< change_settings f

//> color input t
//>1 change color setting t
export const change_settings_color = r.curry(change_settings)('color', 'color');
//<1 change color setting t

//>1 change_color_global_checkbox_setting f
export const change_color_global_checkbox_setting = async () => {
    const new_val = ob.color_global_checkbox_state ? ed.color : 'global'

    await db.imgs.update(shared_o.mut.selected_img_id, { color: new_val });
    x.send_message_to_background({ message: "update_imgs_obj", id: shared_o.mut.selected_img_id, storage: 'color', val: new_val });
    x.send_message_to_background({ message: "reload_ed" });
    x.send_message_to_background({ message: 'preload_img' });
    x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'reload_img' }]);
    shared_o.set_color_global_checkbox_val();

    if (new_val == 'global') {
        shared_o.set_color_input_vizualization_color('color', ed.color);
    }
};
//<1 change_color_global_checkbox_setting f

//>1 show_or_hide_color_pickier_when_clicking_on_color_input_vizualization f
export const show_or_hide_color_pickier_when_clicking_on_color_input_vizualization = e => {
    const color_ok_btn_clicked = x.matches(e.target, '.color_ok_btn');

    if (!color_ok_btn_clicked) {
        const previously_opened_color_pickier = shared_o.mut.current_color_pickier.el;

        //>2 try to hide color pickier when clicking outside of color pickier t
        if (previously_opened_color_pickier) { // if current color pickier's current state exsist
            const clicked_outside_of_color_pickier = !shared_o.mut.current_color_pickier.el.contains(e.target);

            if (clicked_outside_of_color_pickier) {
                shared_o.mut.current_color_pickier.el = null;

                show_or_hide_color_pickier(shared_o.mut.current_color_pickier.name, false);

                shared_o.set_color_input_vizualization_color(shared_o.mut.current_color_pickier.name, shared_o.mut.current_color_pickier.color);
            }
        }
        //<2 try to hide color pickier when clicking outside of color pickier t

        //>2 try to show color pickier when clicking on color_input_vizualization t
        const clicked_on_color_input_vizualization = x.matches(e.target, '.color_input_vizualization');

        if (clicked_on_color_input_vizualization) {
            const color_pickier = sb(e.target, '.color_pickier');
            const name = e.target.dataset.name;
            const color_pickier_hidden = !ob.color_pickiers_state[name];
            const clicked_on_same_color_input_vizualization_second_time = previously_opened_color_pickier == color_pickier

            if (color_pickier_hidden && !clicked_on_same_color_input_vizualization_second_time) {
                shared_o.mut.current_color_pickier.el = color_pickier;
                shared_o.mut.current_color_pickier.name = name;
                shared_o.mut.current_color_pickier.color = ob.color_input_vizualization_colors[name];

                show_or_hide_color_pickier(name, true);
                set_color_color_pickier_position(name, 'top');

                const color_pickier_is_fully_visible = color_pickier.getBoundingClientRect().bottom <= window.innerHeight;

                if (!color_pickier_is_fully_visible) {
                    set_color_color_pickier_position(name, 'bottom');
                }
            }
        }
        //<2 try to show color pickier when clicking on color_input_vizualization t
    }
};
//<1 show_or_hide_color_pickier_when_clicking_on_color_input_vizualization f

//>1 show_or_hide_color_pickier f
export const show_or_hide_color_pickier = action((color_pickier, bool) => {
    ob.color_pickiers_state[color_pickier] = bool;
});
//<1 show_or_hide_color_pickier f

//>1 set_color_color_pickier_position f
export const set_color_color_pickier_position = action((color_pickier, val) => {
    ob.color_pickiers_position[color_pickier] = val;
});
//<1 set_color_color_pickier_position f
//< color input t

//> selects text t
//>1 change option value when selecting option; hide / show global options / background color 'Global' checkbox when selecting img / 'Global' option in settings type input t
export const change_select_val = action((storage, val, text) => {
    if (storage == 'settings_type' && val == 'global') {
        shared_o.set_ed_ui_state();
        shared_o.deselect_selected_img();
    }

    if (storage != 'settings_type' || (storage == 'settings_type' && val == 'global')) {
        ob.selected_options[storage] = text;
    }

    if (storage != 'settings_type') {
        change_settings('select', storage, val);

    } else if (storage == 'settings_type' && val == 'specific') {
        alert(x.message('change_img_settings_alert'));
    }
});
//>1 change option value when selecting option; hide / show global options / background color 'Global' checkbox when selecting img / 'Global' option in settings type input t

//>1 get selects text on page load, all images deletion or image selection t  
export const get_selects_text = (mode, settings) => {
    const mode_to_settings_type_dict = {
        'ed': x.message('option_global_text'),
        'img': x.message('option_specific_text'),
    }

    const make_initial_selects_text_obj = r.mapObjIndexed((obj, key) => {
        const extract_text_from_options_obj = (settings) => {
            const get_selected_option_obj = r.find(r.propEq('val', settings[key]));
            const get_selected_option_text = r.prop('text');
            const get_selected_option_text_p = r.pipe(get_selected_option_obj, get_selected_option_text);

            return get_selected_option_text_p(obj);
        };

        return r.ifElse(() => settings[key],
            () => extract_text_from_options_obj(settings),

            () => extract_text_from_options_obj(ed)
        )()
    });

    const set_settings_type_text = r.assoc('settings_type', mode_to_settings_type_dict[mode]);
    const remove_null_items = r.filter(item => item);
    const make_selects_text_obj_p = r.pipe(make_initial_selects_text_obj, set_settings_type_text, remove_null_items);

    return make_selects_text_obj_p(options);
};
//>1 get selects text on page load, all images deletion or image selection t  
//< selects text t 

//> current_img input t
//>1 change_current_img_by_typing_into_currrent_img_input f
export const change_current_img_by_typing_into_currrent_img_input = async e => {
    const actual_value = +e.target.value;

    if (!isNaN(actual_value)) {
        const number_of_imgs = await db.imgs.count();
        mut.corrected_current_img_input_val = actual_value;
        let value_to_insert_into_db = mut.corrected_current_img_input_val - 1;

        if (mut.corrected_current_img_input_val <= 0) {
            mut.corrected_current_img_input_val = 1;
            value_to_insert_into_db = 0;

        } else if (mut.corrected_current_img_input_val > number_of_imgs) {
            if (number_of_imgs != 0) {
                mut.corrected_current_img_input_val = number_of_imgs;

            } else {
                mut.corrected_current_img_input_val = 1;
            }

            value_to_insert_into_db = mut.corrected_current_img_input_val - 1;
        }

        change_current_img_insert_in_db(actual_value, value_to_insert_into_db);
    }
};
//<1 change_current_img_by_typing_into_currrent_img_input f

//>1 change_current_img_by_clicking_on_select_img_btn f
export const change_current_img_by_clicking_on_select_img_btn = () => {
    const any_img_selected = s('.selected_img');

    if (any_img_selected) {
        const selected_img_i = shared_o.get_img_i_by_id(shared_o.mut.selected_img_id);
        const visible_value = selected_img_i + 1;
        const value_to_insert_into_db = selected_img_i;
        change_current_img_insert_in_db(visible_value, value_to_insert_into_db);

    } else {
        alert(x.message('select_img_alert'));
    }
};
//<1 change_current_img_by_clicking_on_select_img_btn f

//>1 change_current_img_insert_in_db f
const change_current_img_insert_in_db = async (visible_value, value_to_insert_into_db) => {
    try {
        x.send_message_to_background({ message: 'clear_change_img_timer' });
        shared_o.change_current_img_input_val(visible_value);
        await db.ed.update(1, { current_img: value_to_insert_into_db, future_img: value_to_insert_into_db + 1 });
        await shared_b_o.get_new_future_img(value_to_insert_into_db + 1);
        await x.get_ed();
        await x.send_message_to_background_c({ message: "reload_ed" });
        await x.send_message_to_background({ message: 'preload_img' });
        x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'reload_img' }]);

    } catch (er) {
        console.error(er);
    }
};
//<1 change_current_img_insert_in_db f

//>1 correct current image input value when defocusing correct image input t
export const correct_current_img_input_val = () => {
    if (mut.corrected_current_img_input_val) {
        shared_o.change_current_img_input_val(mut.corrected_current_img_input_val);

        mut.corrected_current_img_input_val = null;
    }
};
//<1 correct current image input value when defocusing correct image input t
//< current_img input t

//> restore_default_global_settings f
export const restore_default_global_settings = async () => {
    const confirm = window.confirm(x.message('restore_global_defaults_confirm'));

    if (confirm) {
        browser.runtime.getBackgroundPage(async background => {
            try {
                await background.set_default_settings('options');
                await x.get_ed();
                shared_o.deselect_selected_img();
                shared_o.change_current_img_input_val(1);
                shared_o.set_ed_ui_state();
                shared_o.decide_what_input_items_to_hide();

            } catch (er) {
                console.error(er);
            }
        });
    }
}
//< restore_default_global_settings f

//> varibles t
export const options = selects_options;

let mut = {
    corrected_current_img_input_val: null
}

export let ob;

x.get_ed(() => {
    ob = observable({
        selected_options: get_selects_text('ed', ed),
        show_global_options: false,
        color_global_checkbox_state: false,
        current_img_input_val: ed.current_img + 1,
        color_input_vizualization_colors: {
            create_solid_color_img: '#ffffff',
            color: ''
        },
        color_pickiers_state: {
            create_solid_color_img: false,
            color: false
        },
        color_pickiers_position: {
            create_solid_color_img: 'top',
            color: 'top'
        }
    });
});
//< varibles t