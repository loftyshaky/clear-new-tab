import { observable, runInAction, configure } from 'mobx';

import x from 'x';
import { db } from 'js/init_db';
import * as populate_storage_with_images_and_display_them from 'js/populate_storage_with_images_and_display_them';

configure({ enforceActions: 'observed' });

export const set_total_number_of_backgrounds = async () => {
    try {
        const number_of_backgrounds = await db.backgroundsd.count();

        runInAction(() => {
            try {
                ob.number_of_backgrounds = number_of_backgrounds;

            } catch (er) {
                err(er, 185);
            }
        });

    } catch (er) {
        err(er, 184);
    }
};

export const set_total_number_of_backgrounds_and_switch_to_last_or_previous_page = async unpacked_backgrounds => {
    try {
        const last_page_btn = s('.pagination_btn:last-child');

        if (last_page_btn) {
            const last_visible_page_number_btn_before = s('.pagination_btn:nth-last-child(3)');
            const last_visible_page_number_btn_active_before = x.matches(last_visible_page_number_btn_before, '.active');
            const last_visible_page_number_btn_page_number_before = last_visible_page_number_btn_before.textContent;

            await set_total_number_of_backgrounds();

            const last_visible_page_number_btn_after = s('.pagination_btn:nth-last-child(3)');
            const last_page_btn_disabled_after = x.matches(last_page_btn, '.disabled');
            const last_visible_page_number_btn_page_number_after = last_visible_page_number_btn_after.textContent;

            if (!last_page_btn_disabled_after) {
                last_page_btn.click();

            } else if (unpacked_backgrounds) {
                populate_storage_with_images_and_display_them.create_loaded_backgrounds_on_background_load(unpacked_backgrounds);
            }

            if (last_page_btn_disabled_after && last_visible_page_number_btn_active_before && last_visible_page_number_btn_page_number_before > last_visible_page_number_btn_page_number_after) {
                last_visible_page_number_btn_after.click();
            }
        }

    } catch (er) {
        err(er, 186);
    }
};

export const ob = observable({
    number_of_backgrounds: 0,
});
