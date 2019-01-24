import x from 'x';
import { observable, action, configure } from 'mobx';

configure({ enforceActions: 'observed' });


export const add_and_remove_tabindex_to_pagination_els = async () => {
    const pagination_btn = sa('.pagination_btn');

    set_tabindex(pagination_btn, 0);
    set_tabindex(sa('.pagination_btn a'), -1);

    pagination_btn.forEach(btn => {
        const btn_is_disabled = x.matches(btn, '.disabled, .active');

        if (btn_is_disabled) {
            btn.removeAttribute('tabindex');
        }
    });
};

const set_tabindex = (els, tabindex_value) => {
    els.forEach(btn => {
        btn.setAttribute('tabindex', tabindex_value);
    });
};

export const change_page = action(new_page => {
    ob.active_page = new_page;
});

export const ob = observable({
    active_page: 1,
});
