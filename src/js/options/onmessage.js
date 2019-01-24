import { runInAction, configure } from 'mobx';
import * as r from 'ramda';

import x from 'x';
import { db } from 'js/init_db';
import * as shared_b_o from 'js/shared_b_o';
import * as populate_storage_with_images_and_display_them from 'js/populate_storage_with_images_and_display_them';
import * as shared_o from 'options/shared_o';
import * as img_deletion from 'options/img_deletion';

configure({ enforceActions: 'observed' });

//> recieve messages
browser.runtime.onMessage.addListener(async message => {
    const msg = message.message;

    if (msg === 'load_theme_img') { // remove old theme images and then load new
        img_deletion.mut.next_imgs_after_last_visible_img = 'deleting_image_while_adding_theme_img';
        const ids_of_theme_imgs_to_delete_filtered = message.ids_of_theme_imgs_to_delete.filter(id => r.find(r.propEq('id', id), shared_b_o.ob.imgs));
        const there_is_imgs_to_delete = ids_of_theme_imgs_to_delete_filtered && ids_of_theme_imgs_to_delete_filtered.length > 0;
        const number_of_visible_imgs = shared_o.mut.img_w_tr_nodes.length;
        const number_of_imgs = await db.imgs.count();

        if (there_is_imgs_to_delete) {
            //>1 delete old theme images
            const imgs_deleted = shared_b_o.ob.imgs.map(img => {
                const id_of_img_to_delete_matched = ids_of_theme_imgs_to_delete_filtered.indexOf(img.id) > -1;

                return r.ifElse(
                    () => id_of_img_to_delete_matched,
                    () => r.assoc('show_delete', false, img),

                    () => img,
                )();
            });

            runInAction(() => {
                shared_b_o.ob.imgs.replace(imgs_deleted);
            });
            //<1 delete old theme images
        }

        const ids_of_imgs_to_show = await x.send_message_to_background_c({
            message: 'get_ids_of_imgs_to_show_on_place_of_deleted_theme_imgs',
            added_img_id: message.added_img_id,
            number_of_imgs_to_delete: ids_of_theme_imgs_to_delete_filtered.length,
            number_of_imgs,
            number_of_visible_imgs,
        });

        //>1 add new theme image
        const imgs_to_show = await db.imgs.where('id').anyOf(ids_of_imgs_to_show).toArray();

        populate_storage_with_images_and_display_them.unpack_and_load_imgs('theme_img_adding', imgs_to_show, null);
        //<1 add new theme image

    } else if (msg === 'change_current_img_input_val') {
        await x.get_ed();

        shared_o.change_current_img_input_val(ed.current_img + 1);

    } else if (msg !== 'confirm_that_opened_tab_is_new_tab_page_and_that_it_is_not_in_preview_mode') {
        await x.delay(30000); // fixes bug when response is not received from background when sending same message to background while options page is open (firefox only)
    }

    if (msg !== 'confirm_that_opened_tab_is_new_tab_page_and_that_it_is_not_in_preview_mode') {
        return true;
    }

    return undefined;
});
//< recieve messages
