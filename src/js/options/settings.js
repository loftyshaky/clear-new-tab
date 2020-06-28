import { observable, action, runInAction, configure } from 'mobx';
import * as r from 'ramda';

import x from 'x';
import { db } from 'js/init_db';
import * as analytics from 'js/analytics';
import { inputs_data } from 'options/inputs_data';
import * as background_loading from 'options/background_loading';
import * as background_selection from 'options/background_selection';
import * as inputs_hiding from 'options/inputs_hiding';
import * as get_new_future_background from 'js/get_new_future_background';
import * as background_i from 'options/background_i';

configure({ enforceActions: 'observed' });

export const load_settings = async callback => {
    try {
        const ed_all = await eda();

        load_settings_inner('upload', ed_all);
        load_settings_inner('background_settings', ed_all);
        load_settings_inner('other_settings', ed_all);

        if (callback) {
            callback();
        }

    } catch (er) {
        err(er, 146);
    }
};

export const load_settings_inner = (family, settings) => {
    try {
        Object.keys(inputs_data.obj[family]).map(async name => {
            try {
                const val = settings[name];
                const key_exist = typeof val !== 'undefined';

                if (key_exist) {
                    const val_final = await r.cond([
                        [r.equals('video_volume'), async () => (val === 'global' ? ed('video_volume') : val)],
                        [r.equals('current_background'), () => val + 1],
                        [r.T, () => val],
                    ])(name);

                    runInAction(() => {
                        inputs_data.obj[family][name].val = val_final;
                    });
                }

            } catch (er) {
                err(er, 148);
            }
        });

    } catch (er) {
        err(er, 147);
    }
};

export const change_settings = async (input_type, family, name, val) => {
    try {
        const global_and_specefic_storages = ['size', 'position', 'repeat', 'color', 'video_volume'];
        const storage_type = global_and_specefic_storages.indexOf(name) > -1 ? mut.storage_type : 'ed';
        const storage_id = storage_type === 'ed' ? 1 : background_selection.mut.selected_background_id;
        const settings_obj = await db[storage_type].get(storage_id);
        const old_val = settings_obj[name];
        let new_val;

        if (input_type === 'checkbox') {
            new_val = !old_val;

        } else if (input_type === 'select' || input_type === 'color' || input_type === 'slider') {
            new_val = val;
        }

        if (input_type === 'select' && val === 'theme') {
            await select_theme_background_when_selecting_theme_mode();
        }

        await db[storage_type].update(storage_id, { [name]: new_val });

        if (input_type !== 'slider') {
            change_input_val(family, name, new_val);
        }

        inputs_hiding.decide_what_inputs_to_hide();

        await x.send_message_to_background_c({ message: 'update_backgrounds_obj', id: storage_id, storage: name, val: new_val });

        if (name === 'mode' || name === 'change_interval') {
            await x.send_message_to_background({ message: 'reset_timer' });
        }

        if (input_type === 'select' && val === 'theme' && ['chrome', 'edge'].includes(env.what_browser)) {
            await x.send_message_to_background_c({ message: 'get_theme_background', reinstall_even_if_theme_background_already_exist: false, reload_call: true });
        }

        await x.send_message_to_background({ message: 'preload_background' });

        if (input_type === 'color') {
            mut.current_color_pickier.el = null;

            set_color_input_vizualization_color('background_settings', 'color', new_val);
        }

        if (storage_type === 'backgroundsd') {
            set_global_checkbox_val(name);
        }

        x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'reload_background' }]);

    } catch (er) {
        err(er, 149);
    }
};

export const change_settings_slider = x.debounce(change_settings, 200);

//> color input
export const change_settings_color = r.curry(change_settings)('color', 'background_settings');

export const change_global_checkbox_setting = async name => {
    try {
        const ed_all = await eda();
        const new_val = inputs_data.obj.background_settings[name].global_checkbox_val ? ed_all[name] : 'global';

        await db.backgroundsd.update(background_selection.mut.selected_background_id, { [name]: new_val });
        await x.send_message_to_background_c({ message: 'update_backgrounds_obj', id: background_selection.mut.selected_background_id, storage: name, val: new_val });
        await x.send_message_to_background_c({ message: 'preload_background' });
        set_global_checkbox_val(name);

        if (new_val === 'global') {
            set_color_input_vizualization_color('background_settings', [name], ed_all[name]);
            change_input_val('background_settings', name, ed_all[name]);
        }

        x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'reload_background' }]);

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
                    cancel_color_picking();
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
                    analytics.send_event('color_pickiers', `showed-${family}-${name}`);

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

        if (!bool) {
            inputs_data.obj[family][name].changed_color_once_after_focus = false;
        }

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

export const close_color_pickier_by_keyboard = e => {
    try {
        const { family, name } = mut.current_color_pickier;
        const any_color_pickier_is_opened = mut.current_color_pickier.el;
        const enter_pressed = e.keyCode === 13;
        const esc_pressed = e.keyCode === 27;

        if (enter_pressed && any_color_pickier_is_opened) {
            document.activeElement.blur(); // prevent color_input_vizualization focus
        }

        if (enter_pressed) {
            if (any_color_pickier_is_opened) {
                const { vizualization_color } = inputs_data.obj[family][name];

                determine_and_run_accept_color_f(family, name, vizualization_color);
            }

        } else if (esc_pressed) {
            cancel_color_picking();
        }

    } catch (er) {
        err(er, 216);
    }
};

export const cancel_color_picking = () => {
    try {
        const { family, name, color } = mut.current_color_pickier;

        analytics.send_event('color_pickiers', `canceled-${family}-${name}`);

        const any_color_pickier_is_opened = mut.current_color_pickier.el;

        if (any_color_pickier_is_opened) {
            mut.current_color_pickier.el = null;

            show_or_hide_color_pickier(family, name, false);

            set_color_input_vizualization_color(family, name, color);
        }
    } catch (er) {
        err(er, 217);
    }
};

export const determine_and_run_accept_color_f = (family, name, vizualization_color) => {
    try {
        if (family !== 'background_settings') {
            background_loading.create_solid_color_img(vizualization_color);

        } else {
            change_settings_color(name, vizualization_color);
        }

        show_or_hide_color_pickier(family, name, false);

    } catch (er) {
        err(er, 218);
    }
};
//< color input

//> current_background input
export const change_current_background_by_typing_into_currrent_background_input = async e => {
    try {
        const actual_value = +e.target.value;

        if (!Number.isNaN(actual_value)) {
            const number_of_backgrounds = await db.backgroundsd.count();
            mut.corrected_current_background_input_val = actual_value;
            let value_to_insert_into_db = mut.corrected_current_background_input_val - 1;

            if (mut.corrected_current_background_input_val <= 0) {
                mut.corrected_current_background_input_val = 1;
                value_to_insert_into_db = 0;

            } else if (mut.corrected_current_background_input_val > number_of_backgrounds) {
                if (number_of_backgrounds !== 0) {
                    mut.corrected_current_background_input_val = number_of_backgrounds;

                } else {
                    mut.corrected_current_background_input_val = 1;
                }

                value_to_insert_into_db = mut.corrected_current_background_input_val - 1;
            }

            change_current_background_insert_in_db(actual_value, value_to_insert_into_db);
        }

    } catch (er) {
        err(er, 154);
    }
};

export const change_current_background_by_clicking_on_select_background_btn = () => {
    try {
        analytics.send_btns_event('background_settings', 'current_background');

        const any_background_selected = s('.selected_background');

        if (any_background_selected) {
            const selected_background_i = background_i.get_background_i_by_id(background_selection.mut.selected_background_id) + background_i.determine_background_i_modificator();
            const visible_value = selected_background_i + 1;
            const value_to_insert_into_db = selected_background_i;
            change_current_background_insert_in_db(visible_value, value_to_insert_into_db);

        } else {
            analytics.send_alerts_event('select_background');

            window.alert(x.msg('select_background_alert'));
        }

    } catch (er) {
        err(er, 155);
    }
};

export const change_current_background_insert_in_db = async (visible_value, value_to_insert_into_db) => {
    try {
        x.send_message_to_background({ message: 'reset_timer' });
        change_current_background_input_val(visible_value);
        await db.ed.update(1, { current_background: value_to_insert_into_db, future_background: value_to_insert_into_db + 1 });
        await get_new_future_background.get_new_future_background(value_to_insert_into_db + 1);
        await x.send_message_to_background_c({ message: 'preload_background' });
        x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'reload_background' }]);

    } catch (er) {
        err(er, 156);
    }
};

//>1 correct current image input value when defocusing correct image input
export const correct_current_background_input_val = () => {
    try {
        if (mut.corrected_current_background_input_val) {
            change_current_background_input_val(mut.corrected_current_background_input_val);

            mut.corrected_current_background_input_val = null;
        }

    } catch (er) {
        err(er, 157);
    }
};
//<1 correct current image input value when defocusing correct image input
//< current_background input

export const restore_defaults = async () => {
    try {
        const family = 'other_settings';
        const name = 'restore_defaults';

        analytics.send_btns_event(family, name);

        const confirm = window.confirm(x.msg('restore_defaults_confirm'));

        if (confirm) {
            analytics.send_confirms_accepted_event(name);

            const background = await x.get_background();

            await background.set_default_settings('options');
            background_selection.deselect_selected_background(true);
            switch_to_settings_type(null, null, true);
            inputs_hiding.decide_what_inputs_to_hide();
            await select_theme_background_when_selecting_theme_mode();
            await x.send_message_to_background_c({ message: 'get_theme_background', reinstall_even_if_theme_background_already_exist: false, reload_call: true });
            x.send_message_to_background({ message: 'preload_background' });

        } else {
            analytics.send_confirms_canceled_event(name);
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

export const change_current_background_input_val = action(val => {
    try {
        inputs_data.obj.background_settings.current_background.val = val;

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

export const set_global_checkbox_val = async name => {
    try {
        const settings_obj = await db.backgroundsd.get(background_selection.mut.selected_background_id);

        runInAction(() => {
            try {
                if (settings_obj[name] === 'global') {
                    inputs_data.obj.background_settings[name].global_checkbox_val = true;

                } else {
                    inputs_data.obj.background_settings[name].global_checkbox_val = false;
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

            load_settings();
            set_color_input_vizualization_color('background_settings', 'color', ed_all.color);
            background_selection.deselect_selected_background(true);
            show_or_hide_global_options(false);
            inputs_hiding.decide_what_inputs_to_hide();
        }

        if (name === 'settings_type' && val === 'specific') {
            analytics.send_alerts_event('change_background_settings');

            window.alert(x.msg('change_background_settings_alert'));
        }

    } catch (er) {
        err(er, 165);
    }
};

export const select_theme_background_when_selecting_theme_mode = async () => {
    try {
        const new_current_background = await x.send_message_to_background_c({ message: 'get_new_current_background_when_choosing_theme_mode' });

        await db.ed.update(1, { current_background: new_current_background });
        change_current_background_input_val(new_current_background + 1);
        await get_new_future_background.get_new_future_background(new_current_background + 1);

    } catch (er) {
        err(er, 209);
    }
};

export const mut = {
    storage_type: 'ed',
    corrected_current_background_input_val: null,
    current_color_pickier: {
        el: null,
        name: '',
        color: '',
    },
};

export const ob = observable({
    global_options_is_visible: false,
});
