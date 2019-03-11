import { observable, action, configure } from 'mobx';

import x from 'x';
import { db } from 'js/init_db';
import * as analytics from 'js/analytics';
import * as populate_storage_with_images_and_display_them from 'js/populate_storage_with_images_and_display_them';
import * as background_loading from 'options/background_loading';
import * as settings from 'options/settings';
import * as background_selection from 'options/background_selection';
import * as pagination from 'options/pagination';
import * as get_new_future_background from 'js/get_new_future_background';
import * as determine_theme_current_background from 'js/determine_theme_current_background';
import * as total_number_of_backgrounds from 'js/total_number_of_backgrounds';
import * as ui_state from 'options/ui_state';
import * as background_i from 'options/background_i';
import * as inputs_hiding from 'options/inputs_hiding';

configure({ enforceActions: 'observed' });

//> one image deletion
export const delete_background = async background_id => {
    try {
        analytics.send_options_backgrounds_event('deleted');

        ui_state.disable_ui();

        const ed_all = await eda();
        const background_to_delete = await db.backgroundsd.get(background_id);
        const background_to_delete_i = background_i.get_background_i_by_id(background_id);
        const all_backgrounds_background_to_delete_i = background_to_delete_i + background_i.determine_background_i_modificator();
        const background_to_delete_i_is_lower_than_current_background = all_backgrounds_background_to_delete_i < ed_all.current_background;
        const background_to_delete_i_equals_to_current_background = all_backgrounds_background_to_delete_i === ed_all.current_background;
        const deleting_selected_background = background_to_delete_i === background_i.get_background_i_by_id(background_selection.mut.selected_background_id);
        const background_to_delete_is_theme_background = background_to_delete.theme_id;

        const response = await x.send_message_to_background_c({
            message: 'get_id_of_background_to_add',
            next_background_after_last_visible_background_i: background_i.get_background_i_by_el(s('.background_w_tr:last-child')) + 1 + background_i.determine_background_i_modificator(),
            background_to_delete_i,
        });

        let new_current_background;

        mut.next_backgrounds_after_last_visible_background = response.next_background_after_last_visible_background_id === 'background_is_not_existing' ? response.next_background_after_last_visible_background_id : [await db.backgrounds.get(response.next_background_after_last_visible_background_id)];
        if (background_to_delete_i_equals_to_current_background && background_to_delete_is_theme_background) {
            const backgrounds = await x.send_message_to_background_c({ message: 'get_backgrounds_arr' });

            new_current_background = await determine_theme_current_background.determine_theme_current_background(ed_all.last_installed_theme_theme_id, backgrounds);
        }

        await db.transaction('rw', db.ed, db.backgrounds, db.backgroundsd, async () => {
            await db.backgrounds.delete(background_id);
            await db.backgroundsd.delete(background_id);

            if (background_to_delete_i_is_lower_than_current_background || (ed_all.mode !== 'theme' && background_to_delete_i_equals_to_current_background)) {
                new_current_background = ed_all.current_background === 0 ? 0 : ed_all.current_background - 1;

            }

            if (background_to_delete_i_is_lower_than_current_background || (ed_all.mode !== 'theme' && background_to_delete_i_equals_to_current_background) || (background_to_delete_i_equals_to_current_background && background_to_delete_is_theme_background)) {
                await db.ed.update(1, { current_background: new_current_background });
                settings.change_current_background_input_val(new_current_background + 1);
                await get_new_future_background.get_new_future_background(new_current_background + 1);
            }

            if (deleting_selected_background) {
                settings.switch_to_settings_type(null, null, true);
            }
        });

        const background_ws = sa('.background_w');
        const no_backgrounds_left_on_page = background_ws.length === 1;

        hide_background_before_deletion(background_to_delete_i);

        if (no_backgrounds_left_on_page) {
            total_number_of_backgrounds.set_total_number_of_backgrounds_and_switch_to_last_or_previous_page();

        } else {
            total_number_of_backgrounds.set_total_number_of_backgrounds();
        }

        await x.send_message_to_background_c({ message: 'retrieve_backgrounds' });
        await x.send_message_to_background_c({ message: 'preload_background' });
        x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'reload_background' }]);

        inputs_hiding.decide_what_inputs_to_hide();

    } catch (er) {
        err(er, 99);
    }
};

export const delete_background_tr_end_callback = e => {
    try {
        if (x.matches(e.target, '.background_w_tr')) {
            const background_to_delete_i = background_i.get_background_i_by_el(e.target);
            populate_storage_with_images_and_display_them.ob.backgrounds.splice(background_to_delete_i, 1);

            if (mut.next_backgrounds_after_last_visible_background !== 'deleting_background_while_adding_theme_background') {
                if (mut.next_backgrounds_after_last_visible_background !== 'background_is_not_existing') {
                    populate_storage_with_images_and_display_them.unpack_and_load_backgrounds('background_delete', mut.next_backgrounds_after_last_visible_background);

                }

                ui_state.enable_ui();
            }
        }

    } catch (er) {
        err(er, 100);
    }
};

const hide_background_before_deletion = action(deleted_background_i => {
    try {
        if (populate_storage_with_images_and_display_them.ob.backgrounds[deleted_background_i]) {
            populate_storage_with_images_and_display_them.ob.backgrounds[deleted_background_i].show_delete = false;
        }

    } catch (er) {
        err(er, 101);
    }
});
//< one image deletion

//> delete all image
//>1 delete all images when clicking delete_all_backgrounds
export const delete_all_images = async () => {
    try {
        const family = 'other_settings';
        const name = 'delete_all_backgrounds';

        analytics.send_btns_event(family, name);

        const confirm = window.confirm(x.msg('delete_all_backgrounds_confirm'));

        if (confirm) {
            analytics.send_confirms_accepted_event(name);

            ui_state.disable_ui();

            await db.backgrounds.clear();
            await db.backgroundsd.clear();
            await db.ed.update(1, { current_background: 0, future_background: 1 });

            x.send_message_to_background({ message: 'empty_backgrounds_a' });

            hide_backgrounds_w_2();

            settings.change_current_background_input_val(1);
            settings.switch_to_settings_type(null, null, true);

            await x.send_message_to_background({ message: 'preload_background' });
            x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'reload_background' }]);

            pagination.change_page(1);
            total_number_of_backgrounds.set_total_number_of_backgrounds();

            inputs_hiding.decide_what_inputs_to_hide();

        } else {
            analytics.send_confirms_canceled_event(name);
        }

    } catch (er) {
        err(er, 102);
    }
};
//<1 delete all images when clicking delete_all_backgrounds

export const delete_all_images_tr_end = action(() => {
    try {
        if (!ob.show_backgrounds_w_2) {
            populate_storage_with_images_and_display_them.ob.backgrounds.clear();

            ob.show_backgrounds_w_2 = true;

            ui_state.enable_ui();
        }

    } catch (er) {
        err(er, 104);
    }
});
//< delete all image

export const delete_broken_backgrounds = async broken_backgrounds_ids => {
    try {
        await db.transaction('rw', db.ed, db.backgrounds, db.backgroundsd, async () => {
            await db.backgrounds.bulkDelete(broken_backgrounds_ids);
            await db.backgroundsd.bulkDelete(broken_backgrounds_ids);
        });

        await total_number_of_backgrounds.set_total_number_of_backgrounds();

        if (total_number_of_backgrounds.ob.number_of_backgrounds === 0) {
            hide_backgrounds_w_2();

        } else {
            const last_page = Math.ceil(total_number_of_backgrounds.ob.number_of_backgrounds / populate_storage_with_images_and_display_them.con.backgrounds_per_page);

            background_loading.load_page('load_page', last_page);
        }

        settings.switch_to_settings_type(null, null, true);

        await x.send_message_to_background_c({ message: 'retrieve_backgrounds' });
        await x.send_message_to_background_c({ message: 'preload_background' });
        x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'reload_background' }]);

        inputs_hiding.decide_what_inputs_to_hide();

        err(er_obj('Failed to load image'), 272, 'failed_to_load_background');

    } catch (er) {
        err(er, 271);
    }
};

const hide_backgrounds_w_2 = action(() => {
    try {
        ob.show_backgrounds_w_2 = false;

    } catch (er) {
        err(er, 103);
    }
});

export const mut = {
    next_backgrounds_after_last_visible_background: 'background_is_not_existing',
};

export const ob = observable({
    show_backgrounds_w_2: true,
});
