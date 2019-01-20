import * as r from 'ramda';

import x from 'x';
import * as multiple from 'background/multiple';

browser.tabs.query({ currentWindow: true, active: true }, tabs => {
    confirm_that_opened_tab_is_new_tab_page_and_that_it_is_not_in_preview_mode_and_store_id_if_true(tabs[0].id)
}); // get first opened new tab on browser start

//> on updated listener (when openining tab or changing url)
browser.tabs.onUpdated.addListener((id, info) => {
    if (info.status === 'complete') {
        confirm_that_opened_tab_is_new_tab_page_and_that_it_is_not_in_preview_mode_and_store_id_if_true(id);
    }
});
//< on updated listener (when openining tab or changing url)

//> on removed listener (when tab closed)
browser.tabs.onRemoved.addListener(id => {
    clear_timer_if_all_new_tabs_closed(id);
});
//< on removed listener (when tab closed)

const confirm_that_opened_tab_is_new_tab_page_and_that_it_is_not_in_preview_mode_and_store_id_if_true = async id => {
    try {
        const is_opened_tab_new_tab_page = await x.send_message_to_tab_c(id, { message: 'confirm_that_opened_tab_is_new_tab_page_and_that_it_is_not_in_preview_mode' });

        if (is_opened_tab_new_tab_page && mut.new_tabs_ids.indexOf(id) === -1) {
            mut.new_tabs_ids = r.append(id, mut.new_tabs_ids);

        } else if (!is_opened_tab_new_tab_page && mut.new_tabs_ids.indexOf(id) > -1) {
            clear_timer_if_all_new_tabs_closed(id);
        }

    } catch (er) {
        clear_timer_if_all_new_tabs_closed(id);

        console.error(er);
    }
};

const clear_timer_if_all_new_tabs_closed = id => {
    if (mut.new_tabs_ids.indexOf(id) > -1) {
        mut.new_tabs_ids = r.without([id], mut.new_tabs_ids);
    }

    const last_new_tab_closed = mut.new_tabs_ids.length === 0;

    if (last_new_tab_closed) {
        multiple.clear_timer();
    }
};

export const mut = {
    new_tabs_ids: [],
};
