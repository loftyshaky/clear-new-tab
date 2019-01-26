import { observable, runInAction, configure } from 'mobx';

import x from 'x';
import { db } from 'js/init_db';
import * as populate_storage_with_images_and_display_them from 'js/populate_storage_with_images_and_display_them';

configure({ enforceActions: 'observed' });

export const set_total_number_of_imgs = async () => {
    const number_of_imgs = await db.imgs.count();

    runInAction(() => {
        ob.number_of_imgs = number_of_imgs;
    });
};

export const set_total_number_of_imgs_and_switch_to_last_or_previous_page = async unpacked_imgs => {
    const last_page_btn = s('.pagination_btn:last-child');

    if (last_page_btn) {
        const last_visible_page_number_btn_before = s('.pagination_btn:nth-last-child(3)');
        const last_visible_page_number_btn_active_before = x.matches(last_visible_page_number_btn_before, '.active');
        const last_visible_page_number_btn_page_number_before = last_visible_page_number_btn_before.textContent;

        await set_total_number_of_imgs();

        const last_visible_page_number_btn_after = s('.pagination_btn:nth-last-child(3)');
        const last_page_btn_disabled_after = x.matches(last_page_btn, '.disabled');
        const last_visible_page_number_btn_page_number_after = last_visible_page_number_btn_after.textContent;

        if (!last_page_btn_disabled_after) {
            last_page_btn.click();

        } else if (unpacked_imgs) {
            populate_storage_with_images_and_display_them.create_loaded_imgs_on_img_load(unpacked_imgs);
        }

        if (last_page_btn_disabled_after && last_visible_page_number_btn_active_before && last_visible_page_number_btn_page_number_before > last_visible_page_number_btn_page_number_after) {
            last_visible_page_number_btn_after.click();
        }
    }
};

export const ob = observable({
    number_of_imgs: 0,
});
