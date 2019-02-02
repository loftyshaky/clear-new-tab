'use_strict';

import { observable, action, runInAction, configure } from 'mobx';
import * as r from 'ramda';

import x from 'x';
import { db } from 'js/init_db';
import { inputs_data } from 'options/inputs_data';
import { selects_options } from 'options/selects_options';
import * as img_selection from 'options/img_selection';
import * as inputs_hiding from 'options/inputs_hiding';
import * as get_new_future_img from 'js/get_new_future_img';
import * as img_i from 'options/img_i';

configure({ enforceActions: 'observed' });

export const load_settings = async callback => {
    try {
        const ed_all = await eda();

        load_settings_inner('upload', ed_all);
        load_settings_inner('img_settings', ed_all);

        callback();

    } catch (er) {
        err(er, 146);
    }
};

export const load_settings_inner = action((family, settings) => {
    try {
        Object.keys(inputs_data.obj[family]).map(async name => {
            try {
                const val = settings[name];
                const key_exist = typeof val !== 'undefined';

                if (key_exist) {
                    const val_final = name === 'current_img' ? val + 1 : val;

                    inputs_data.obj[family][name].val = val_final;
                }

            } catch (er) {
                err(er, 148);
            }
        });

    } catch (er) {
        err(er, 147);
    }
});

export const change_settings = async (input_type, family, name, val) => {
    try {
        const global_and_specefic_storages = ['size', 'position', 'repeat', 'color'];
        const storage_type = global_and_specefic_storages.indexOf(name) > -1 ? mut.storage_type : 'ed';
        const storage_id = storage_type === 'ed' ? 1 : img_selection.mut.selected_img_id;
        const settings_obj = await db[storage_type].get(storage_id);
        const old_val = settings_obj[name];
        let new_val;

        if (input_type === 'checkbox') {
            new_val = !old_val;

        } else if (input_type === 'select' || input_type === 'color') {
            new_val = val;
        }

        if (input_type === 'select' && val === 'theme') {
            select_theme_img_when_selecting_theme_mode();
        }

        await db[storage_type].update(storage_id, { [name]: new_val });

        change_input_val(family, name, new_val);

        inputs_hiding.decide_what_inputs_to_hide();
        x.send_message_to_background({ message: 'update_imgs_obj', id: storage_id, storage: name, val: new_val });

        if (name === 'mode' || name === 'change_interval') {
            await x.send_message_to_background({ message: 'reset_timer' });
        }

        if (input_type === 'select' && val === 'theme' && what_browser === 'chrome') {
            await x.send_message_to_background_c({ message: 'get_theme_img', reinstall_even_if_theme_img_already_exist: false });
        }

        x.send_message_to_background({ message: 'preload_img' });

        if (input_type === 'color') {
            mut.current_color_pickier.el = null;

            set_color_input_vizualization_color('img_settings', 'color', new_val);

            if (storage_type === 'imgs') {
                set_color_global_checkbox_val('color');
            }
        }

        x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'reload_img' }]);

    } catch (er) {
        err(er, 149);
    }
};

//> color input
export const change_settings_color = r.curry(change_settings)('color', 'img_settings');

export const change_color_global_checkbox_setting = async name => {
    try {
        const ed_all = await eda();
        const new_val = inputs_data.obj.img_settings[name].color_global_checkbox_val ? ed_all[name] : 'global';

        await db.imgs.update(img_selection.mut.selected_img_id, { [name]: new_val });
        x.send_message_to_background({ message: 'update_imgs_obj', id: img_selection.mut.selected_img_id, storage: name, val: new_val });
        x.send_message_to_background({ message: 'preload_img' });
        x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'reload_img' }]);
        set_color_global_checkbox_val(name);

        if (new_val === 'global') {
            set_color_input_vizualization_color('img_settings', [name], ed_all[name]);
        }

    } catch (er) {
        err(er, 150);
    }
};

export const show_or_hide_color_pickier_when_clicking_on_color_input_vizualization = e => {
    try {
        const color_ok_btn_clicked = x.matches(e.target, '.color_ok_btn');

        if (!color_ok_btn_clicked) {
            const previously_opened_color_pickier = mut.current_color_pickier.el;

            //>1 try to hide color pickier when clicking outside of color pickier
            if (previously_opened_color_pickier) { // if current color pickier's current state exsist
                const clicked_outside_of_color_pickier = !mut.current_color_pickier.el.contains(e.target);

                if (clicked_outside_of_color_pickier) {
                    mut.current_color_pickier.el = null;

                    show_or_hide_color_pickier(mut.current_color_pickier.family, mut.current_color_pickier.name, false);

                    set_color_input_vizualization_color(mut.current_color_pickier.family, mut.current_color_pickier.name, mut.current_color_pickier.color);
                }
            }
            //<1 try to hide color pickier when clicking outside of color pickier

            //>1 try to show color pickier when clicking on color_input_vizualization
            const clicked_on_color_input_vizualization = x.matches(e.target, '.color_input_vizualization');

            if (clicked_on_color_input_vizualization) {
                const { family, name } = e.target.dataset;
                const color_pickier = sb(e.target, '.color_pickier');
                const color_pickier_hidden = !inputs_data.obj[family][name].color_pickier_is_visible;
                const clicked_on_same_color_input_vizualization_second_time = previously_opened_color_pickier === color_pickier;

                if (color_pickier_hidden && !clicked_on_same_color_input_vizualization_second_time) {
                    mut.current_color_pickier.el = color_pickier;
                    mut.current_color_pickier.family = family;
                    mut.current_color_pickier.name = name;
                    mut.current_color_pickier.color = inputs_data.obj[family][name].vizualization_color;

                    show_or_hide_color_pickier(family, name, true);
                    set_color_color_pickier_position(family, name, 'top');

                    const color_pickier_is_fully_visible = color_pickier.getBoundingClientRect().bottom <= window.innerHeight;

                    if (!color_pickier_is_fully_visible) {
                        set_color_color_pickier_position(family, name, 'bottom');
                    }
                }
            }
            //<1 try to show color pickier when clicking on color_input_vizualization
        }

    } catch (er) {
        err(er, 151);
    }
};

export const show_or_hide_color_pickier = action((family, name, bool) => {
    try {
        inputs_data.obj[family][name].color_pickier_is_visible = bool;

    } catch (er) {
        err(er, 152);
    }
});

export const set_color_color_pickier_position = action((family, name, val) => {
    try {
        inputs_data.obj[family][name].color_pickier_position = val;

    } catch (er) {
        err(er, 153);
    }
});
//< color input

//> current_img input
export const change_current_img_by_typing_into_currrent_img_input = async e => {
    try {
        const actual_value = +e.target.value;

        if (!Number.isNaN(actual_value)) {
            const number_of_imgs = await db.imgs.count();
            mut.corrected_current_img_input_val = actual_value;
            let value_to_insert_into_db = mut.corrected_current_img_input_val - 1;

            if (mut.corrected_current_img_input_val <= 0) {
                mut.corrected_current_img_input_val = 1;
                value_to_insert_into_db = 0;

            } else if (mut.corrected_current_img_input_val > number_of_imgs) {
                if (number_of_imgs !== 0) {
                    mut.corrected_current_img_input_val = number_of_imgs;

                } else {
                    mut.corrected_current_img_input_val = 1;
                }

                value_to_insert_into_db = mut.corrected_current_img_input_val - 1;
            }

            change_current_img_insert_in_db(actual_value, value_to_insert_into_db);
        }

    } catch (er) {
        err(er, 154);
    }
};

export const change_current_img_by_clicking_on_select_img_btn = () => {
    try {
        const any_img_selected = s('.selected_img');

        if (any_img_selected) {
            const selected_img_i = img_i.get_img_i_by_id(img_selection.mut.selected_img_id) + img_i.determine_img_i_modificator();
            const visible_value = selected_img_i + 1;
            const value_to_insert_into_db = selected_img_i;
            change_current_img_insert_in_db(visible_value, value_to_insert_into_db);

        } else {
            window.alert(x.msg('select_img_alert'));
        }

    } catch (er) {
        err(er, 155);
    }
};

export const change_current_img_insert_in_db = async (visible_value, value_to_insert_into_db) => {
    try {
        x.send_message_to_background({ message: 'reset_timer' });
        change_current_img_input_val(visible_value);
        await db.ed.update(1, { current_img: value_to_insert_into_db, future_img: value_to_insert_into_db + 1 });
        await get_new_future_img.get_new_future_img(value_to_insert_into_db + 1);
        await x.send_message_to_background({ message: 'preload_img' });
        x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'reload_img' }]);

    } catch (er) {
        err(er, 156);
    }
};

//>1 correct current image input value when defocusing correct image input
export const correct_current_img_input_val = () => {
    try {
        if (mut.corrected_current_img_input_val) {
            change_current_img_input_val(mut.corrected_current_img_input_val);

            mut.corrected_current_img_input_val = null;
        }

    } catch (er) {
        err(er, 157);
    }
};
//<1 correct current image input value when defocusing correct image input
//< current_img input

export const restore_default_global_settings = async () => {
    try {
        const confirm = window.confirm(x.msg('restore_global_defaults_confirm'));

        if (confirm) {
            const background = await x.get_background();

            await background.set_default_settings('options');
            img_selection.deselect_selected_img(true);
            switch_to_settings_type(null, null, true);
            inputs_hiding.decide_what_inputs_to_hide();
            await select_theme_img_when_selecting_theme_mode();
            await x.send_message_to_background_c({ message: 'get_theme_img', reinstall_even_if_theme_img_already_exist: false });
            x.send_message_to_background({ message: 'preload_img' });
        }

    } catch (er) {
        err(er, 158);
    }
};

export const change_input_val = action((family, name, val) => {
    try {
        inputs_data.obj[family][name].val = val;

    } catch (er) {
        err(er, 159);
    }
});

export const change_current_img_input_val = action(val => {
    try {
        inputs_data.obj.img_settings.current_img.val = val;

    } catch (er) {
        err(er, 160);
    }
});

export const set_color_input_vizualization_color = action((family, name, color) => {
    try {
        inputs_data.obj[family][name].vizualization_color = color;

    } catch (er) {
        err(er, 161);
    }
});

export const show_or_hide_global_options = action(bool => {
    try {
        ob.global_options_is_visible = bool;

    } catch (er) {
        err(er, 162);
    }
});

export const set_color_global_checkbox_val = async name => {
    try {
        const settings_obj = await db.imgs.get(img_selection.mut.selected_img_id);

        runInAction(() => {
            try {
                if (settings_obj[name] === 'global') {
                    inputs_data.obj.img_settings[name].color_global_checkbox_val = true;

                } else {
                    inputs_data.obj.img_settings[name].color_global_checkbox_val = false;
                }

            } catch (er) {
                err(er, 164);
            }
        });

    } catch (er) {
        err(er, 163);
    }
};

export const switch_to_settings_type = async (name, val, force_inputs_reset) => {
    try {
        if ((name === 'settings_type' && val === 'global') || force_inputs_reset) {
            const ed_all = await eda();
            mut.storage_type = 'ed';

            load_settings_inner('img_settings', ed_all);
            set_color_input_vizualization_color('img_settings', 'color', ed_all.color);
            img_selection.deselect_selected_img(true);
            show_or_hide_global_options(false);
        }

        if (name === 'settings_type' && val === 'specific') {
            window.alert(x.msg('change_img_settings_alert'));
        }

    } catch (er) {
        err(er, 165);
    }
};

const select_theme_img_when_selecting_theme_mode = async () => {
    try {
        const new_current_img = await x.send_message_to_background_c({ message: 'get_new_current_img_when_choosing_theme_mode' });

        await db.ed.update(1, { current_img: new_current_img });
        change_current_img_input_val(new_current_img + 1);
        await get_new_future_img.get_new_future_img(new_current_img + 1);

    } catch (er) {
        err(er, 209);
    }
};

export const options = selects_options;

export const mut = {
    storage_type: 'ed',
    corrected_current_img_input_val: null,
    current_color_pickier: {
        el: null,
        name: '',
        color: '',
    },
};

export const ob = observable({
    global_options_is_visible: false,
});
