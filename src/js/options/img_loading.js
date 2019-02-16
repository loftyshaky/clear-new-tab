'use_strict';

import { observable, action, configure } from 'mobx';
import * as r from 'ramda';

import x from 'x';
import { db } from 'js/init_db';
import * as populate_storage_with_images_and_display_them from 'js/populate_storage_with_images_and_display_them';
import * as upload_messages from 'js/upload_messages';
import * as convert_to_file_object from 'js/convert_to_file_object';
import { inputs_data } from 'options/inputs_data';
import * as settings from 'options/settings';
import * as pagination from 'options/pagination';
import * as ui_state from 'options/ui_state';
import * as file_types from 'js/file_types';

configure({ enforceActions: 'observed' });

//> paste image or image url
export const get_pasted_image_or_image_url = async e => {
    try {
        ui_state.disable_ui();
        upload_messages.hide_upload_box_messages();
        upload_messages.change_paste_input_placeholder_val(x.msg('upload_box_uploading_message_text'));

        const pasted_img_clipboard_item = r.find(clipboard_item => clipboard_item.type.indexOf('image') > -1, e.clipboardData.items); // ordinary for each will not work | check if img (its file object (after it will be converted with getAsFile below) if is) pasted
        const pasted_img_file_object = pasted_img_clipboard_item ? pasted_img_clipboard_item.getAsFile() : null; // not link, copied image
        const clipboard_text = e.clipboardData.getData('text');
        const input_given_text = clipboard_text !== '';
        const contains_allow_downloading_images_by_link_permission = inputs_data.obj.upload.download_img_when_link_given.val;
        const download_img_when_link_given = await ed('download_img_when_link_given');

        const img = await r.ifElse(
            () => contains_allow_downloading_images_by_link_permission && download_img_when_link_given && input_given_text,
            async () => {
                try {
                    const response = await window.fetch(clipboard_text);
                    const blob = await response.blob();
                    if (blob.type.indexOf('image') > -1) {
                        const file_object = convert_to_file_object.convert_to_file_object(blob);
                        return file_object;
                    }

                    t('File given is not image.');

                } catch (er) {
                    err(er, 106, null, true);
                }

                return undefined;
            },

            () => {
                try {
                    return pasted_img_file_object;

                } catch (er) {
                    err(er, 107);
                }

                return undefined;
            },
        )();

        const is_file = img;

        if (is_file) {
            populate_storage_with_images_and_display_them.populate_storage_with_images('file', 'resolved_paste', [img], {}, null);

        } else if (input_given_text) { // if link
            try {
                await new Promise((resolve, reject) => {
                    const test_img = new Image();

                    test_img.onload = () => {
                        resolve();
                    };

                    test_img.onerror = () => {
                        reject(er_obj('Not a link.'));
                    };

                    test_img.src = clipboard_text;
                });

                populate_storage_with_images_and_display_them.populate_storage_with_images('link', 'resolved_paste', [clipboard_text], {}, null);

            } catch (er) {
                err(er, 108, null, true);

                populate_storage_with_images_and_display_them.show_or_hide_upload_error_messages('rejected_paste');
            }

        } else { // if anything other (error)
            populate_storage_with_images_and_display_them.show_or_hide_upload_error_messages('rejected_paste');
        }

        ui_state.enable_ui();

    } catch (er) {
        err(er, 105);
    }
};
//< paste image or image url

//> filter files loaded with upload box (keep only images) and call put in db function
export const handle_files = async files => {
    try {
        ui_state.disable_ui();
        upload_messages.change_paste_input_placeholder_val(null);
        upload_messages.hide_upload_box_messages();
        upload_messages.show_upload_box_uploading_message();

        const filter_out_non_media = r.filter(img => {
            try {
                const is_allowed_media = file_types.con.exts[img.type];

                return is_allowed_media;

            } catch (er) {
                err(er, 110);
            }

            return undefined;
        });

        const get_put_in_db_f = imgs => {
            try {
                const files_len = files.length;
                const get_f = r.cond([
                    [r.equals(0), () => r.partial(populate_storage_with_images_and_display_them.show_or_hide_upload_error_messages, ['rejected'])], // all files are not images
                    [r.equals(files_len), () => r.partial(populate_storage_with_images_and_display_them.populate_storage_with_images, ['file', 'resolved', imgs, {}, null])], // all files are images
                    [r.compose(r.not, r.equals(files_len)), () => r.partial(populate_storage_with_images_and_display_them.populate_storage_with_images, ['file', 'resolved_with_errors', imgs, {}, null])], // some files are not images
                ]);

                return get_f(imgs.length);

            } catch (er) {
                err(er, 111);
            }

            return undefined;
        };

        const put_in_db_p = r.pipe(filter_out_non_media, get_put_in_db_f);

        await put_in_db_p(files)();

        ui_state.enable_ui();

    } catch (er) {
        err(er, 109);
    }
};
//< filter files loaded with upload box (keep only images) and call put in db function

//> create_solid_color_img
export const create_solid_color_img = color => {
    try {
        populate_storage_with_images_and_display_them.populate_storage_with_images('color', 'resolved_color', [color], {}, null);

        settings.set_color_input_vizualization_color('upload', 'create_solid_color_img', color);

        settings.mut.current_color_pickier.el = null;

    } catch (er) {
        err(er, 112);
    }
};
//< create_solid_color_img

//> create images on extensions' options page on load or click on load btn
export const load_page = async (mode, page, null_scroll_to) => { // g
    try {
        ui_state.disable_ui();

        const offset = page * populate_storage_with_images_and_display_them.con.imgs_per_page - populate_storage_with_images_and_display_them.con.imgs_per_page;

        if (mode === 'load_page') {
            pagination.change_page(page);
        }

        const imgs = await db.imgsd.orderBy('position_id').offset(offset).limit(populate_storage_with_images_and_display_them.con.imgs_per_page).toArray();
        const number_of_imgs = imgs.length;

        if (number_of_imgs > 0) {
            populate_storage_with_images_and_display_them.unpack_and_load_imgs(mode, imgs, null_scroll_to);
        }

        if (number_of_imgs === 0) {
            hide_loading_screen();

            ui_state.enable_ui();
        }

        if (mode === 'load_page') {
            change_css_counter_offset(offset);
        }

    } catch (er) {
        err(er, 113);
    }
};
//< create images on extensions' options page on load or click on load btn

const change_css_counter_offset = action(offset => {
    ob.css_counter_offset = offset;
});

//> show one image after it fully loaded
export const show_loaded_img = async img_w => {
    try {
        await x.delay(100);

        x.remove_cls(sb(img_w, '.img_inner_w_2'), 'opacity_0');

    } catch (er) {
        err(er, 114);
    }
};
//< show one image after it fully loaded

//> show transparency background checkerboard
export const show_checkerboard = async img_w => {
    try {
        await x.delay(100);

        x.add_cls(img_w, 'checkerboard');

    } catch (er) {
        err(er, 115);
    }
};
//< show transparency background checkerboard

export const hide_loading_screen = action(() => {
    try {
        ob.show_loading_screen = false;

    } catch (er) {
        err(er, 116);
    }
}); //> hide loading_screen when images loaded on options page load

export const mut = {
    imgs_loaded: 0,
    img_inner_w_2_mounts_transparent: false,
};

export const ob = observable({
    show_loading_screen: true,
    css_counter_offset: 0,
});
