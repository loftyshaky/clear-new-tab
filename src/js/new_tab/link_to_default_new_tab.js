import { observable, runInAction, configure } from 'mobx';

configure({ enforceActions: 'observed' });

export const set_show_link_to_default_new_tab_observable = async () => {
    try {
        const show_link_to_default_new_tab = await ed('show_link_to_default_new_tab');

        runInAction(() => {
            try {
                ob.show_link_to_default_new_tab = show_link_to_default_new_tab;

            } catch (er) {
                err(er, 220);
            }
        });

    } catch (er) {
        err(er, 221);
    }
};

export const ob = observable({
    show_link_to_default_new_tab: false,
});
