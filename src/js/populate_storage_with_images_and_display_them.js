import { action, configure } from 'mobx';
import * as r from 'ramda';

import x from 'x';

import { db } from 'js/init_db';
import * as shared_b_o from 'js/shared_b_o';
import * as upload_messages from 'js/upload_messages';
import * as total_number_of_imgs from 'js/total_number_of_imgs';

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

        if (number_of_img_w && number_of_img_w < shared_b_o.sta.imgs_per_page) {
            const mode = 'upload_imgs';
            const imgs_to_load = packed_imgs.slice(0, shared_b_o.sta.imgs_per_page - number_of_img_w); // get first 50 of uploaded images
            unpack_and_load_imgs(mode, imgs_to_load, packed_imgs);
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
export const unpack_and_load_imgs = async (mode, imgs_to_load, packed_imgs) => {
    const unpacked_imgs = imgs_to_load.map(img => ({
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

    if (mode === 'load_page') {
        create_loaded_imgs_on_page_change(unpacked_imgs);

    } else {
        const uploaded_imgs_reach_next_page = r.ifElse(
            () => mode === 'upload_imgs',
            () => {
                const number_of_img_w_before_insertion = sa('.img_w').length;

                return number_of_img_w_before_insertion + packed_imgs.length > shared_b_o.sta.imgs_per_page;
            },

            () => false,
        )();

        if (mode !== 'upload_imgs' || !uploaded_imgs_reach_next_page) {
            create_loaded_imgs_on_img_load(unpacked_imgs);
        }
    }

    await total_number_of_imgs.set_total_number_of_imgs();

    //>1 switch to last page if uploaded images reached new page
    if (mode === 'upload_imgs' || mode === 'theme_img_adding') {
        const last_page_btn = s('.pagination_btn:last-child');

        last_page_btn.click();
    }
    //<1 switch to last page if uploaded images reached new page
};
//< prepare images for loading in images fieldset and then load them into it

//> insert images in images fieldset (set state)
export const create_loaded_imgs_on_page_change = action(imgs => {
    shared_b_o.ob.imgs.replace(imgs);
});

const create_loaded_imgs_on_img_load = action(imgs => {
    const all_imgs = r.union(shared_b_o.ob.imgs.slice())(imgs); // visible + uploaded now images
    const first_50_or_less_imgs = r.take(50, all_imgs);

    shared_b_o.ob.imgs.replace(first_50_or_less_imgs);
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

const generate_random_pastel_color = () => `hsl(${360 * Math.random()},${25 + 70 * Math.random()}%,${70 + 10 * Math.random()}%)`;
