import * as r from 'ramda';

import x from 'x';
import * as multiple from 'background/multiple';

//> on updated listener (when openining tab or changing url)
browser.tabs.onUpdated.addListener((id, info) => {
    if (info.status === 'complete') {
        remove_tab_id(id);
        confirm_that_opened_tab_is_new_tab_page_and_that_it_is_not_in_preview_mode_and_store_id_if_true(id);
    }
});
//< on updated listener (when openining tab or changing url)

//> on removed listener (when tab closed)
browser.tabs.onRemoved.addListener(id => {
    remove_tab_id(id);
});
//< on removed listener (when tab closed)

export const confirm_that_opened_tab_is_new_tab_page_and_that_it_is_not_in_preview_mode_and_store_id_if_true = async id => {
    try {
        const is_opened_tab_new_tab_page = await x.send_message_to_tab_c(id, { message: 'confirm_that_opened_tab_is_new_tab_page_and_that_it_is_not_in_preview_mode' });

        if (is_opened_tab_new_tab_page && mut.new_tabs_ids.indexOf(id) === -1) {
            mut.new_tabs_ids = r.append(id, mut.new_tabs_ids);

            multiple.start_timer(true);
        }

    } catch (er) {
        console.error(er);
    }
};

const remove_tab_id = id => {
    if (mut.new_tabs_ids.indexOf(id) > -1) {
        mut.new_tabs_ids = r.without([id], mut.new_tabs_ids);
    }
};

export const mut = {
    new_tabs_ids: [],
};
