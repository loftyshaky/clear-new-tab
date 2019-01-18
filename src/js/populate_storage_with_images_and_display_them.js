import { action, runInAction, configure } from 'mobx';
import * as r from 'ramda';

import x from 'x';

import { db } from 'js/init_db';
import * as shared_b_o from 'js/shared_b_o';
import * as upload_messages from 'js/upload_messages';

configure({ enforceActions: 'observed' });

//> pack images and insert them in db
export const populate_storage_with_images = async (type, status, imgs, theme_img_info, theme_id) => {
    try {
        //>1 pack images
        const add_theme_modifier_to_type = () => (r.isEmpty(theme_img_info) ? type : `theme_${type}`);

        const number_of_imgs = await db.imgs.count();
        const position_id = await r.ifElse(() => number_of_imgs > 0,
            async () => {
                const ordered_imgs = db.imgs.orderBy('position_id');
                const img_with_highest_id = await ordered_imgs.last();

                return img_with_highest_id.position_id + 1;
            },

            () => 0)();

        const packed_imgs = imgs.map((item, i) => {
            if (type !== 'color') {
                const img = {
                    id: x.unique_id(),
                    position_id: position_id + i,
                    theme_id,
                    img: item,
                    type: add_theme_modifier_to_type(),
                    size: theme_img_info.size || 'global',
                    position: theme_img_info.position || 'global',
                    repeat: theme_img_info.repeat || 'global',
                    color: theme_img_info.color || 'global',
                };

                return img;

            } if (type === 'color') {
                const img = {
                    id: x.unique_id(),
                    position_id: position_id + i,
                    theme_id,
                    img: item,
                    type: add_theme_modifier_to_type(),
                };

                return img;
            }

            return undefined;
        });
        //<1 pack images

        //>1 insert image packs in db
        const last_img_id = await db.transaction('rw', db.imgs, () => db.imgs.bulkAdd(packed_imgs));
        //<1 insert image packs in db

        const number_of_img_w = sa('.img_w').length;

        if (number_of_img_w < 50) {
            const mode = 'load_more';
            const imgs_to_load = packed_imgs.slice(0, 50 - number_of_img_w); // get first 50 of uploaded images

            unpack_and_load_imgs(imgs_to_load, mode, 0);

        } else {
            hide_or_show_load_btns('uploaded_imgs_but_not_added_any_imgs_to_ui');
        }

        //>1 reload img_a in background.js
        if (page === 'options') {
            await x.send_message_to_background_c({ message: 'retrieve_imgs' });
        }
        //>1 reload img_a in background.js

        await shared_b_o.get_new_future_img(ed.current_img + 1);
        await x.send_message_to_background({ message: 'preload_img' });
        x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'reload_img' }]);
        show_or_hide_upload_error_messages(status);

        return last_img_id;

    } catch (er) {
        console.error(er);

        show_or_hide_upload_error_messages('resolved_with_errors');

        x.error(1);
    }

    return undefined;
};
//< pack images and insert them in db

//> prepare images for loading in images fieldset and then load them into it
export const unpack_and_load_imgs = (imgs, mode, hide_or_show_load_btns_f_minus_val) => {
    const unpacked_imgs = imgs.map(img => ({
        key: x.unique_id(),
        id: img.id,
        placeholder_color: generate_random_pastel_color(),
        img: img.type.indexOf('file') > -1 ? URL.createObjectURL(img.img) : img.img,
        type: img.type,
        img_size: '?',
        show: mode === 'first_load' || false,
        show_delete: true,
        show_checkerboard: mode === 'first_load' || false,
        selected: false,
    }));

    create_loaded_imgs(unpacked_imgs, hide_or_show_load_btns_f_minus_val);
};
//< prepare images for loading in images fieldset and then load them into it

//> insert images in images fieldset (set state)
export const create_loaded_imgs = action(imgs => {
    shared_b_o.ob.imgs.replace(r.union(shared_b_o.ob.imgs.slice())(imgs));

    const last_inserted_img_id = imgs[imgs.length - 1] ? imgs[imgs.length - 1].id : 'uploaded_imgs_but_not_added_any_imgs_to_ui';

    hide_or_show_load_btns(last_inserted_img_id);
});
//< insert images in images fieldset (set state)

export const show_or_hide_upload_error_messages = status => {
    upload_messages.hide_upload_box_messages();

    if (status === 'rejected' || status === 'resolved_with_errors') {
        upload_messages.show_upload_box_error_message();
    }

    if (status === 'resolved_paste') {
        upload_messages.change_paste_input_placeholder_val(null);
    }

    if (status === 'rejected_paste') {
        upload_messages.change_paste_input_placeholder_val(x.msg('upload_box_error_message_text'));
    }
};

const hide_or_show_load_btns = async last_inserted_img_id => {
    try {
        const number_of_imgs = await db.imgs.count();
        const last_img_in_db = await db.imgs.orderBy('position_id').last();
        const there_is_img_after_last_inserted_img = !!(last_inserted_img_id === 'uploaded_imgs_but_not_added_any_imgs_to_ui' || last_inserted_img_id !== last_img_in_db.id);

        runInAction(() => {
            if (number_of_imgs > 50 && there_is_img_after_last_inserted_img) {
                shared_b_o.ob.show_load_btns_w = true;

            } else {
                shared_b_o.ob.show_load_btns_w = false;
            }
        });

    } catch (er) {
        console.error(er);
    }
};

const generate_random_pastel_color = () => `hsl(${360 * Math.random()},${25 + 70 * Math.random()}%,${70 + 10 * Math.random()}%)`;
