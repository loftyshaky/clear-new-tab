//> get_new_future_img f

//> get_random_img f

//> generate_random_color f

//^

'use_strict';

import x from 'x';
import { db } from 'js/init_db';

import * as r from 'ramda';

//> get_new_future_img f
export const get_new_future_img = async new_future_img => {
    const number_of_imgs = await db.imgs.count();
    const there_is_no_imgs_in_db = number_of_imgs == 0;

    if (there_is_no_imgs_in_db) {
        new_future_img = 0;

    } else if (!ed.shuffle) {
        if (new_future_img >= number_of_imgs) {
            new_future_img = 0;
        }

    } else {
        new_future_img = await get_random_img(number_of_imgs);
    }

    await db.ed.update(1, { future_img: new_future_img });
};
//< get_new_future_img f

//> get_random_img f
const get_random_img = async (number_of_imgs) => {
    await x.get_ed();
    const there_is_no_imgs_or_one_img_in_db = number_of_imgs <= 1;
    let new_future_img = r.clone(ed).current_img;

    while (new_future_img == ed.current_img && !there_is_no_imgs_or_one_img_in_db) {
        new_future_img = Math.floor(Math.random() * number_of_imgs); // new future current img
    }

    return new_future_img;
}
//< get_random_img f

//> generate_random_color f
export const generate_random_color = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';

    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
};
//< generate_random_color f