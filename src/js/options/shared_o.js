import { observable, action, runInAction, configure } from 'mobx';

import x from 'x';
import { db } from 'js/init_db';
import * as permissions from 'options/permissions';
import * as settings from 'options/settings';
import * as img_loading from 'js/img_loading';

configure({ enforceActions: 'observed' });

export const get_img_i_by_id = img_id => ob.imgs.findIndex(img => img.id === img_id);

export const get_img_i_by_el = el => Array.prototype.slice.call(mut.img_w_tr_nodes).indexOf(el);

export const decide_what_inputs_to_hide = action(async () => {
    try {
        ob.hidable_inputs.keep_old_themes_imgs = ed.mode === 'theme';
        ob.hidable_inputs.slideshow = !!(ed.mode === 'multiple' || ed.mode === 'random_solid_color');
        ob.hidable_inputs.shuffle = ed.mode === 'multiple';
        ob.hidable_inputs.change_interval = !!(ed.mode === 'multiple' || ed.mode === 'random_solid_color');
        ob.hidable_inputs.current_img = !!(ed.mode === 'one' || ed.mode === 'multiple');

        const contains_allow_downloading_images_by_link_permission = await permissions.contains_permission(permissions.permissions_dict.allow_downloading_images_by_link);
        const contains_enable_paste_permission = await permissions.contains_permission(permissions.permissions_dict.enable_paste);

        runInAction(() => {
            ob.hidable_inputs.download_img_when_link_given = !!contains_allow_downloading_images_by_link_permission;
            ob.hidable_inputs.paste_btn = !!contains_enable_paste_permission;
        });

    } catch (er) {
        console.error(er);
    }
});

export const deselect_selected_img = action(() => {
    const selected_img_i = get_img_i_by_id(mut.selected_img_id);
    const img_exist = ob.imgs[selected_img_i]; // if not deleted selected image

    if (img_exist) {
        ob.imgs[selected_img_i].selected = false;
    }
});

export const set_selects_text = action((settings_type, obj_to_get_selects_text_from) => {
    settings.ob.selected_options = settings.get_selects_text(settings_type, obj_to_get_selects_text_from);
});

export const show_or_hide_global_options = action(bool => {
    settings.ob.show_global_options = bool;
});

export const set_color_input_vizualization_color = action((name, color) => {
    settings.ob.color_input_vizualization_colors[name] = color;
});

export const change_current_img_input_val = action(val => {
    settings.ob.current_img_input_val = val;
});

export const set_color_global_checkbox_val = async () => {
    const settings_obj = await db.imgs.get(mut.selected_img_id);

    runInAction(() => {
        if (settings_obj.color === 'global') {
            settings.ob.color_global_checkbox_state = true;

        } else {
            settings.ob.color_global_checkbox_state = false;
        }
    });
};

export const set_ed_ui_state = () => {
    mut.storage_type = 'ed';

    show_or_hide_global_options(false);
    set_selects_text('ed', ed);
    set_color_input_vizualization_color('color', ed.color);
};

//> enable / disable ui
export const enable_ui = () => x.remove(s('.ui_disabled'));
export const disable_ui = () => x.load_css('ui_disabled');
//< enable / disable ui

//> prepare images for loading in images fieldset and then load them into it
export const unpack_and_load_imgs = (imgs, mode, hide_or_show_load_btns_f_minus_val) => {
    const unpacked_imgs = imgs.map(img => ({
        key: x.unique_id(),
        id: img.id,
        placeholder_color: img_loading.generate_random_pastel_color(),
        img: img.type.indexOf('file') > -1 ? URL.createObjectURL(img.img) : img.img,
        type: img.type,
        img_size: '?',
        show: mode === 'first_load' || false,
        show_delete: true,
        show_checkerboard: mode === 'first_load' || false,
        selected: false,
    }));

    img_loading.create_loaded_imgs(unpacked_imgs, hide_or_show_load_btns_f_minus_val);
};
//< prepare images for loading in images fieldset and then load them into it

export const calculate_offset = async mode => {
    const number_of_imgs = await db.imgs.count();

    if (mode === 'first_load' || (mode === 'load_more' && mut.offset <= number_of_imgs - 50)) {
        mut.offset += 50;

    } else if (mode === 'load_all' && mut.offset <= number_of_imgs - 1000) {
        mut.offset += 1000;

    } else if (mode === 'load_more' || mode === 'load_all' || (mode === 'img_delete' && number_of_imgs >= 50)) {
        mut.offset = number_of_imgs;
    }
};

export const mut = {
    img_w_tr_nodes: null,
    storage_type: 'ed',
    selected_img_id: 1,
    offset: 0,
    current_color_pickier: {
        el: null,
        name: '',
        color: '',
    },
};

export const ob = observable({
    imgs: [],
    show_load_btns_w: false,
    hidable_inputs: {
        download_img_when_link_given: false,
        paste_btn: false,
    },
});
