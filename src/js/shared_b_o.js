'use_strict';

import * as r from 'ramda';
import { observable } from 'mobx';

import x from 'x';
import { db } from 'js/init_db';

export const get_new_future_img = async new_future_img => {
    const number_of_imgs = await db.imgs.count();
    const there_is_no_imgs_in_db = number_of_imgs === 0;
    let new_future_img_final = new_future_img;

    if (there_is_no_imgs_in_db) {
        new_future_img_final = 0;

    } else if (!ed.shuffle) {
        if (new_future_img >= number_of_imgs) {
            new_future_img_final = 0;
        }

    } else {
        new_future_img_final = await get_random_img(number_of_imgs);
    }

    await db.ed.update(1, { future_img: new_future_img_final });
};

const get_random_img = async number_of_imgs => {
    await x.get_ed();

    const there_is_no_imgs_or_one_img_in_db = number_of_imgs <= 1;
    let new_future_img = r.clone(ed).current_img;

    while (new_future_img === ed.current_img && !there_is_no_imgs_or_one_img_in_db) {
        new_future_img = Math.floor(Math.random() * number_of_imgs); // new future current img
    }

    return new_future_img;
};

export const generate_random_color = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';

    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
};

export const blob_to_file = blob => new File([blob], '', { type: blob.type }); // '' is file name, it means that file object was created from blob object

export const ob = observable({
    imgs: [],
});
