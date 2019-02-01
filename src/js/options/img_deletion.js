'use_strict';

import { observable, action, runInAction, configure } from 'mobx';

import x from 'x';
import { db } from 'js/init_db';
import * as populate_storage_with_images_and_display_them from 'js/populate_storage_with_images_and_display_them';
import * as settings from 'options/settings';
import * as img_selection from 'options/img_selection';
import * as pagination from 'options/pagination';
import * as get_new_future_img from 'js/get_new_future_img';
import * as determine_theme_current_img from 'js/determine_theme_current_img';
import * as total_number_of_imgs from 'js/total_number_of_imgs';
import * as ui_state from 'options/ui_state';
import * as img_i from 'options/img_i';

configure({ enforceActions: 'observed' });

//> one image deletion
export const delete_img = async img_id => {
    try {
        ui_state.disable_ui();

        const ed_all = await eda();
        const img_to_delete = await db.imgs.get(img_id);
        const img_to_delete_i = img_i.get_img_i_by_id(img_id);
        const all_imgs_img_to_delete_i = img_to_delete_i + img_i.determine_img_i_modificator();
        const img_to_delete_i_is_lower_than_current_img = all_imgs_img_to_delete_i < ed_all.current_img;
        const img_to_delete_i_equals_to_current_img = all_imgs_img_to_delete_i === ed_all.current_img;
        const deleting_selected_img = img_to_delete_i === img_i.get_img_i_by_id(img_selection.mut.selected_img_id);
        const img_to_delete_is_theme_img = img_to_delete.theme_id;

        const response = await x.send_message_to_background_c({
            message: 'get_id_of_img_to_add',
            next_img_after_last_visible_img_i: img_i.get_img_i_by_el(s('.img_w_tr:last-child')) + 1 + img_i.determine_img_i_modificator(),
            img_to_delete_i,
        });

        let new_current_img;

        mut.next_imgs_after_last_visible_img = response.next_img_after_last_visible_img_id === 'img_not_existing' ? response.next_img_after_last_visible_img_id : [await db.imgs.get(response.next_img_after_last_visible_img_id)];
        if (img_to_delete_i_equals_to_current_img && img_to_delete_is_theme_img) {
            const imgs = await x.send_message_to_background_c({ message: 'get_imgs_arr' });

            new_current_img = await determine_theme_current_img.determine_theme_current_img(ed_all.last_installed_theme_theme_id, imgs);
        }

        await db.transaction('rw', db.ed, db.imgs, async () => {
            await db.imgs.delete(img_id);

            if (img_to_delete_i_is_lower_than_current_img || (ed_all.mode !== 'theme' && img_to_delete_i_equals_to_current_img)) {
                new_current_img = ed_all.current_img === 0 ? 0 : ed_all.current_img - 1;

            }

            if (img_to_delete_i_is_lower_than_current_img || (ed_all.mode !== 'theme' && img_to_delete_i_equals_to_current_img) || (img_to_delete_i_equals_to_current_img && img_to_delete_is_theme_img)) {
                await db.ed.update(1, { current_img: new_current_img });
                settings.change_current_img_input_val(new_current_img + 1);
                await get_new_future_img.get_new_future_img(new_current_img + 1);
            }

            if (deleting_selected_img) {
                settings.switch_to_settings_type(null, null, true);
            }
        });

        const img_ws = sa('.img_w');
        const no_imgs_left_on_page = img_ws.length === 1;

        hide_img_before_deletion(img_to_delete_i);

        if (no_imgs_left_on_page) {
            total_number_of_imgs.set_total_number_of_imgs_and_switch_to_last_or_previous_page();

        } else {
            total_number_of_imgs.set_total_number_of_imgs();
        }

        await x.send_message_to_background_c({ message: 'retrieve_imgs' });
        await x.send_message_to_background({ message: 'preload_img' });
        x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'reload_img' }]);

    } catch (er) {
        err(er, 99);
    }
};

export const delete_img_tr_end_callback = e => {
    try {
        if (x.matches(e.target, '.img_w_tr')) {
            const img_to_delete_i = img_i.get_img_i_by_el(e.target);
            populate_storage_with_images_and_display_them.ob.imgs.splice(img_to_delete_i, 1);

            if (mut.next_imgs_after_last_visible_img !== 'deleting_image_while_adding_theme_img') {
                if (mut.next_imgs_after_last_visible_img !== 'img_not_existing') {
                    populate_storage_with_images_and_display_them.unpack_and_load_imgs('img_delete', mut.next_imgs_after_last_visible_img);

                }

                ui_state.enable_ui();
            }
        }

    } catch (er) {
        err(er, 100);
    }
};

const hide_img_before_deletion = action(deleted_img_i => {
    try {
        populate_storage_with_images_and_display_them.ob.imgs[deleted_img_i].show_delete = false;

    } catch (er) {
        err(er, 101);
    }
});
//< one image deletion

//> delete all image
//>1 delete all images when clicking delete_all_imgs
export const delete_all_images = async () => {
    try {
        const confirm = window.confirm(x.msg('delete_all_images_confirm'));

        if (confirm) {
            ui_state.disable_ui();

            await db.imgs.clear();
            await db.ed.update(1, { current_img: 0, future_img: 1 });

            x.send_message_to_background({ message: 'empty_imgs_a' });

            runInAction(() => {
                try {
                    ob.show_imgs_w_2 = false;

                } catch (er) {
                    err(er, 103);
                }
            });

            settings.change_current_img_input_val(1);
            settings.switch_to_settings_type(null, null, true);

            await x.send_message_to_background({ message: 'preload_img' });
            x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'reload_img' }]);

            pagination.change_page(1);
            total_number_of_imgs.set_total_number_of_imgs();
        }

    } catch (er) {
        err(er, 102);
    }
};
//<1 delete all images when clicking delete_all_imgs

export const delete_all_images_tr_end = action(() => {
    try {
        if (!ob.show_imgs_w_2) {
            populate_storage_with_images_and_display_them.ob.imgs.clear();

            ob.show_imgs_w_2 = true;

            ui_state.enable_ui();
        }

    } catch (er) {
        err(er, 104);
    }
});
//< delete all image

export const mut = {
    next_imgs_after_last_visible_img: 'img_not_existing',
};

export const ob = observable({
    show_imgs_w_2: true,
});
