import * as r from 'ramda';

import { db } from 'js/init_db';

export const get_new_future_img = async new_future_img => {
    try {
        const shuffle = await ed('shuffle');
        const number_of_imgs = await db.imgsd.count();
        const there_is_no_imgs_in_db = number_of_imgs === 0;
        let new_future_img_final = new_future_img;

        if (there_is_no_imgs_in_db) {
            new_future_img_final = 0;

        } else if (!shuffle) {
            if (new_future_img >= number_of_imgs) {
                new_future_img_final = 0;
            }

        } else {
            new_future_img_final = await get_random_img(number_of_imgs);
        }

        await db.ed.update(1, { future_img: new_future_img_final });

    } catch (er) {
        err(er, 14);
    }
};

const get_random_img = async number_of_imgs => {
    try {
        const ed_all = await eda();

        const there_is_no_imgs_or_one_img_in_db = number_of_imgs <= 1;
        let new_future_img = r.clone(ed_all).current_img;

        while (new_future_img === ed_all.current_img && !there_is_no_imgs_or_one_img_in_db) {
            new_future_img = Math.floor(Math.random() * number_of_imgs); // new future current img
        }

        return new_future_img;

    } catch (er) {
        err(er, 15);
    }

    return undefined;
};
