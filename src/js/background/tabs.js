import x from 'x';
import { db } from 'js/init_db';
import * as shared_b from 'background/shared_b';
import * as multiple from 'background/multiple';

//> on updated listener (when openining tab or changing url)
browser.tabs.onUpdated.addListener((id, info) => {
    if (info.status === 'complete') {
        confirm_that_opened_tab_is_new_tab_page_and_that_it_is_not_in_preview_mode(id, (id_, is_opened_tab_new_tab_page) => {
            if (is_opened_tab_new_tab_page && mut.new_tabs_ids.indexOf(id_) === -1) {
                mut.new_tabs_ids.push(id_);

            } else if (!is_opened_tab_new_tab_page && mut.new_tabs_ids.indexOf(id_) > -1) {
                mut.new_tabs_ids.splice(mut.new_tabs_ids.indexOf(id_), 1);
            }

            if (is_opened_tab_new_tab_page) {
                update_time_setting_and_start_timer();
            }
        });
    }
});
//< on updated listener (when openining tab or changing url)

//> on removed listener (when tab closed)
browser.tabs.onRemoved.addListener(id => {
    if (mut.new_tabs_ids.indexOf(id) > -1) {
        mut.new_tabs_ids.splice(mut.new_tabs_ids.indexOf(id), 1);
    }
});
//< on removed listener (when tab closed)

const confirm_that_opened_tab_is_new_tab_page_and_that_it_is_not_in_preview_mode = async (id, callback) => {
    let is_opened_tab_new_tab_page;

    try {
        is_opened_tab_new_tab_page = await x.send_message_to_tab_c(id, { message: 'confirm_that_opened_tab_is_new_tab_page_and_that_it_is_not_in_preview_mode' });

    } catch (er) {
        console.error(er);

    } finally {
        callback(id, is_opened_tab_new_tab_page);
    }
};

export const update_time_setting_and_start_timer = async () => {
    const ms_left = shared_b.get_ms_left();

    if (ms_left <= 0) {
        const time = new Date().getTime();

        await db.ed.update(1, { last_img_change_time: time });
        await x.get_ed();
    }

    multiple.start_timer();
};

export const mut = {
    new_tabs_ids: [],
};
