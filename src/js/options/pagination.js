'use_strict';

import { observable, action, configure } from 'mobx';

import x from 'x';
import * as analytics from 'js/analytics';

configure({ enforceActions: 'observed' });

export const add_and_remove_tabindex_to_pagination_els = async () => {
    try {
        const pagination_btns = sa('.pagination_btn');

        set_tabindex(pagination_btns, 0);
        set_tabindex(sa('.pagination_btn a'), -1);

        for (const pagination_btn of pagination_btns) {
            const btn_is_disabled = x.matches(pagination_btn, '.disabled, .active');

            if (btn_is_disabled) {
                pagination_btn.removeAttribute('tabindex');
            }
        }

    } catch (er) {
        err(er, 136);
    }
};

const set_tabindex = (pagination_btns, tabindex_value) => {
    try {
        for (const pagination_btn of pagination_btns) {
            pagination_btn.setAttribute('tabindex', tabindex_value);
        }

    } catch (er) {
        err(er, 137);
    }
};

export const send_click_to_pagination_btn = e => { // fixes bug when page not changing when mousedowning and then dragging pagination_btn
    try {
        const pagination_btn = x.closest(e.target, '.pagination_btn');

        if (pagination_btn) { // pagination_btn is not active / disabled

            pagination_btn.click();

            const new_page = s('.pagination_btn.active a').textContent;

            analytics.send_event('pagination', `switched_to_page_${new_page}`);
        }

    } catch (er) {
        err(er, 138);
    }
};

export const change_page = action(new_page => {
    try {
        ob.active_page = new_page;

    } catch (er) {
        err(er, 139);
    }
});

export const ob = observable({
    active_page: 1,
});
