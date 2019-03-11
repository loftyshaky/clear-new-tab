import * as populate_storage_with_images_and_display_them from 'js/populate_storage_with_images_and_display_them';
import * as pagination from 'options/pagination';

export const get_background_i_by_id = background_id => populate_storage_with_images_and_display_them.ob.backgrounds.findIndex(background => {
    try {
        return background.id === background_id;

    } catch (er) {
        err(er, 268);
    }

    return undefined;
});

export const get_background_i_by_el = el => {
    try {
        return Array.prototype.slice.call(mut.background_w_tr_nodes).indexOf(el);

    } catch (er) {
        err(er, 269);
    }

    return undefined;
};

export const determine_background_i_modificator = () => {
    try {
        return pagination.ob.active_page * populate_storage_with_images_and_display_them.con.backgrounds_per_page - populate_storage_with_images_and_display_them.con.backgrounds_per_page;

    } catch (er) {
        err(er, 70);
    }

    return undefined;
};

export const mut = {
    background_w_tr_nodes: null,
};
