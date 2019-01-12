import { observable, action, runInAction, configure } from 'mobx';

import x from 'x';
import { db } from 'js/init_db';
import * as shared_b_o from 'js/shared_b_o';
import * as determine_theme_current_img from 'js/determine_theme_current_img';
import * as shared_o from 'options/shared_o';

configure({ enforceActions: true });

//> one image deletion
export const delete_img = async img_id => {
    try {
        shared_o.disable_ui();

        const img_to_delete = await db.imgs.get(img_id);
        const img_to_delete_i = shared_o.get_img_i_by_id(img_id);
        const img_to_delete_i_is_lower_than_current_img = img_to_delete_i < ed.current_img;
        const img_to_delete_i_equals_to_current_img = img_to_delete_i === ed.current_img;
        const deleting_selected_img = img_to_delete_i === shared_o.get_img_i_by_id(shared_o.mut.selected_img_id);
        const img_to_delete_is_theme_img = img_to_delete.theme_id;

        const response = await x.send_message_to_background_c({
            message: 'get_id_of_img_to_add',
            next_img_after_last_visible_img_i: shared_o.get_img_i_by_el(s('.img_w_tr:last-child')) + 1,
            img_to_delete_i,
        });

        let new_current_img;

        mut.next_imgs_after_last_visible_img = response.next_img_after_last_visible_img_id === 'img_not_existing' ? response.next_img_after_last_visible_img_id : [await db.imgs.get(response.next_img_after_last_visible_img_id)];

        if (img_to_delete_i_equals_to_current_img && img_to_delete_is_theme_img) {
            const imgs = await x.send_message_to_background_c({ message: 'get_imgs_arr' });

            new_current_img = await determine_theme_current_img.determine_theme_current_img(ed.last_installed_theme_theme_id, imgs);
        }

        await db.transaction('rw', db.ed, db.imgs, async () => {
            await db.imgs.delete(img_id);

            if (img_to_delete_i_is_lower_than_current_img || (ed.mode !== 'theme' && img_to_delete_i_equals_to_current_img)) {
                new_current_img = ed.current_img === 0 ? 0 : ed.current_img - 1;

            }

            if (img_to_delete_i_is_lower_than_current_img || (ed.mode !== 'theme' && img_to_delete_i_equals_to_current_img) || (img_to_delete_i_equals_to_current_img && img_to_delete_is_theme_img)) {
                await db.ed.update(1, { current_img: new_current_img });
                shared_o.change_current_img_input_val(new_current_img + 1);
                await shared_b_o.get_new_future_img(new_current_img + 1);
            }

            if (deleting_selected_img) {
                shared_o.set_ed_ui_state();
            }
        });

        await x.send_message_to_background_c({ message: 'reload_ed' });
        await x.get_ed();
        await x.send_message_to_background_c({ message: 'retrieve_imgs' });
        await x.send_message_to_background({ message: 'preload_img' });
        x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'reload_img' }]);
        hide_img_before_deletion(img_to_delete_i);

    } catch (er) {
        console.error(er);
    }
};

export const delete_img_tr_end_callback = e => {
    if (x.matches(e.target, '.img_w_tr')) {
        const img_to_delete_i = shared_o.get_img_i_by_el(e.target);
        shared_o.ob.imgs.splice(img_to_delete_i, 1);

        if (mut.next_imgs_after_last_visible_img !== 'deleting_image_while_adding_theme_img') {
            if (mut.next_imgs_after_last_visible_img !== 'img_not_existing') {
                shared_o.unpack_and_load_imgs(mut.next_imgs_after_last_visible_img, 'img_delete', 1);

            } else {
                shared_o.calculate_offset('img_delete');
            }

            shared_o.enable_ui();
        }
    }
};

const hide_img_before_deletion = action(img_i => {
    shared_o.ob.imgs[img_i].show_delete = false;
});
//< one image deletion

//> delete all image
//>1 delete all images when clicking delete_all_imgs
export const delete_all_images = async () => {
    const confirm = window.confirm(x.msg('delete_all_images_confirm'));

    if (confirm) {
        try {
            shared_o.disable_ui();

            await db.imgs.clear();
            await db.ed.update(1, { current_img: 0, future_img: 1 });

            x.get_ed();
            x.send_message_to_background({ message: 'reload_ed' });
            x.send_message_to_background({ message: 'empty_imgs_a' });

            shared_o.mut.offset = 50;

            runInAction(() => {
                ob.show_imgs_w_1 = false;
                shared_o.ob.show_load_btns_w = false;
            });

            shared_o.change_current_img_input_val(1);
            shared_o.show_or_hide_global_options(false);
            shared_o.set_selects_text('ed', ed);
            await x.send_message_to_background({ message: 'preload_img' });
            x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'reload_img' }]);

        } catch (er) {
            console.error(er);
        }
    }
};
//<1 delete all images when clicking delete_all_imgs

export const delete_all_images_tr_end = action(() => {
    if (!ob.show_imgs_w_1) {
        shared_o.ob.imgs.clear();

        ob.show_imgs_w_1 = true;

        shared_o.enable_ui();
    }
});
//< delete all image

export const mut = {
    next_imgs_after_last_visible_img: 'img_not_existing',
};

export const ob = observable({
    show_imgs_w_1: true,
});
