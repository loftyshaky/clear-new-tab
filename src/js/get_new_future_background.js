import * as r from 'ramda';

import { db } from 'js/init_db';

export const get_new_future_background = async new_future_background => {
    try {
        const shuffle = await ed('shuffle');
        const number_of_backgrounds = await db.backgroundsd.count();
        const there_is_no_backgrounds_in_db = number_of_backgrounds === 0;
        let new_future_background_final = new_future_background;

        if (there_is_no_backgrounds_in_db) {
            new_future_background_final = 0;

        } else if (!shuffle) {
            if (new_future_background >= number_of_backgrounds) {
                new_future_background_final = 0;
            }

        } else {
            new_future_background_final = await get_random_background(number_of_backgrounds);
        }

        await db.ed.update(1, { future_background: new_future_background_final });

    } catch (er) {
        err(er, 14);
    }
};

const get_random_background = async number_of_backgrounds => {
    try {
        const ed_all = await eda();

        const there_is_no_backgrounds_or_one_background_in_db = number_of_backgrounds <= 1;
        let new_future_background = r.clone(ed_all).current_background;

        while (new_future_background === ed_all.current_background && !there_is_no_backgrounds_or_one_background_in_db) {
            new_future_background = Math.floor(Math.random() * number_of_backgrounds); // new future current background
        }

        return new_future_background;

    } catch (er) {
        err(er, 15);
    }

    return undefined;
};
