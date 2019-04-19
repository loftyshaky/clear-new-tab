import { observable, runInAction, configure } from 'mobx';

import { db } from 'js/init_db';

configure({ enforceActions: 'observed' });

export const activate_clear_new_tab = async () => {
    try {
        await db.ed.update(1, { premium: true });

    } catch (er) {
        err(er, 308);
    }
};

export const update_premium_ob = async () => {
    try {
        const premium = await ed('premium');

        runInAction(() => {
            try {
                ob.premium = premium;

            } catch (er) {
                err(er, 317);
            }
        });

    } catch (er) {
        err(er, 316);
    }
};

export const ob = observable({
    premium: false,
});
