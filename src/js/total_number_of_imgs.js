import { observable, runInAction, configure } from 'mobx';

import { db } from 'js/init_db';

configure({ enforceActions: 'observed' });


export const set_total_number_of_imgs = async () => {
    const number_of_imgs = await db.imgs.count();

    runInAction(() => {
        ob.number_of_imgs = number_of_imgs;
    });
};

export const ob = observable({
    number_of_imgs: 0,
});
