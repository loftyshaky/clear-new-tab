'use_strict';

import * as populate_storage_with_images_and_display_them from 'js/populate_storage_with_images_and_display_them';
import * as pagination from 'options/pagination';

export const get_img_i_by_id = img_id => populate_storage_with_images_and_display_them.ob.imgs.findIndex(img => {
    try {
        return img.id === img_id;

    } catch (er) {
        err(er, 268);
    }

    return undefined;
});

export const get_img_i_by_el = el => {
    try {
        return Array.prototype.slice.call(mut.img_w_tr_nodes).indexOf(el);

    } catch (er) {
        err(er, 269);
    }

    return undefined;
};

export const determine_img_i_modificator = () => {
    try {
        return pagination.ob.active_page * populate_storage_with_images_and_display_them.con.imgs_per_page - populate_storage_with_images_and_display_them.con.imgs_per_page;

    } catch (er) {
        err(er, 70);
    }

    return undefined;
};

export const mut = {
    img_w_tr_nodes: null,
};
