import x from 'x';
import * as multiple from 'background/multiple';

browser.tabs.query({ currentWindow: true, active: true }, tabs => mut.new_tabs_ids.push(tabs[0].id)); // get first opened new tab on browser start

//> on updated listener (when openining tab or changing url)
browser.tabs.onUpdated.addListener((id, info) => {
    if (info.status === 'complete') {
        confirm_that_opened_tab_is_new_tab_page_and_that_it_is_not_in_preview_mode(id, (id_, is_opened_tab_new_tab_page) => {
            if (is_opened_tab_new_tab_page && mut.new_tabs_ids.indexOf(id_) === -1) {
                mut.new_tabs_ids.push(id_);

            } else if (!is_opened_tab_new_tab_page && mut.new_tabs_ids.indexOf(id_) > -1) {
                mut.new_tabs_ids.splice(mut.new_tabs_ids.indexOf(id_), 1);
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

    const last_new_tab_closed = mut.new_tabs_ids.length === 0;

    if (last_new_tab_closed) {
        multiple.clear_timer();
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

export const mut = {
    new_tabs_ids: [],
};
