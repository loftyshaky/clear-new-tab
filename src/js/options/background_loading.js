import { observable, action, configure } from 'mobx';
import * as r from 'ramda';

import x from 'x';
import { db } from 'js/init_db';
import * as analytics from 'js/analytics';
import * as populate_storage_with_images_and_display_them from 'js/populate_storage_with_images_and_display_them';
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
        ui_state.hide_upload_box_messages();
        ui_state.change_paste_input_placeholder_val(x.msg('upload_box_uploading_message_text'));

        const family = 'upload';
        const name = 'paste';
        const pasted_img_clipboard_item = r.find(clipboard_item => clipboard_item.type.indexOf('image') > -1, e.clipboardData.items); // ordinary for each will not work | check if img (its file object (after it will be converted with getAsFile below) if is) pasted
        const pasted_img_file_object = pasted_img_clipboard_item ? pasted_img_clipboard_item.getAsFile() : null; // not link, copied image
        const clipboard_text = e.clipboardData.getData('text');
        const input_given_text = clipboard_text !== '';
        const contains_allow_downloading_imgs_by_link_permission = inputs_data.obj.other_settings.allow_downloading_imgs_by_link.val;
        const download_img_when_link_given = await ed('download_img_when_link_given');

        const img = await r.ifElse(
            () => contains_allow_downloading_imgs_by_link_permission && download_img_when_link_given && input_given_text,
            async () => {
                try {
                    const response = await window.fetch(clipboard_text);
                    const blob = await response.blob();
                    if (blob.type.indexOf('image') > -1) {
                        analytics.send_text_inputs_event(`pasted_link_to_img_and_downloaded_it_${blob.type}`, family, name);

                        return blob;
                    }

                    t('File given is not image.');

                } catch (er) {
                    err(er, 106, null, true);
                }

                return undefined;
            },

            () => {
                try {
                    const is_file = pasted_img_file_object;

                    if (is_file) {
                        analytics.send_text_inputs_event(`pasted_img_from_clipboard_${pasted_img_file_object.type}`, family, name);
                    }

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
                        analytics.send_text_inputs_event(`pasted_link_to_img_${clipboard_text.split('.').pop()}`, family, name);

                        resolve();
                    };

                    test_img.onerror = () => {
                        analytics.send_text_inputs_event('tried_to_paste_img_but_its_not_img', family, name);

                        reject(er_obj('Not a link'));
                    };

                    test_img.src = clipboard_text;
                });

                populate_storage_with_images_and_display_them.populate_storage_with_images('link', 'resolved_paste', [clipboard_text], {}, null);

            } catch (er) {
                err(er, 108, null, true);

                ui_state.exit_upload_mode('rejected_paste');
            }

        } else { // if anything other (error)
            ui_state.exit_upload_mode('rejected_paste');
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
        ui_state.enter_upload_mode();

        const filter_out_non_media = r.filter(background => {
            try {
                const is_allowed_media = file_types.con.exts[background.type];

                if (!is_allowed_media) {
                    err(er_obj('File given is not image or video'), 282, null, true);
                }

                return is_allowed_media;

            } catch (er) {
                err(er, 110);
            }

            return undefined;
        });

        const get_put_in_db_f = backgrounds => {
            try {
                const files_len = files.length;
                const get_f = r.cond([
                    [r.equals(0), () => r.partial(ui_state.exit_upload_mode, ['rejected'])], // all files are not images
                    [r.equals(files_len), () => r.partial(populate_storage_with_images_and_display_them.populate_storage_with_images, ['file', 'resolved', backgrounds, {}, null])], // all files are images
                    [r.compose(r.not, r.equals(files_len)), () => r.partial(populate_storage_with_images_and_display_them.populate_storage_with_images, ['file', 'resolved_with_errors', backgrounds, {}, null])], // some files are not images
                ]);

                return get_f(backgrounds.length);

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

        settings.switch_to_settings_type(null, null, true);

        const offset = page * populate_storage_with_images_and_display_them.con.backgrounds_per_page - populate_storage_with_images_and_display_them.con.backgrounds_per_page;

        if (mode === 'load_page') {
            pagination.change_page(page);
        }

        const backgrounds = await db.backgroundsd.orderBy('position_id').offset(offset).limit(populate_storage_with_images_and_display_them.con.backgrounds_per_page).toArray();
        const number_of_backgrounds = backgrounds.length;

        if (number_of_backgrounds > 0) {
            populate_storage_with_images_and_display_them.unpack_and_load_backgrounds(mode, backgrounds, null_scroll_to);
        }

        if (number_of_backgrounds === 0) {
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
export const show_loaded_background = async background_placeholder => {
    try {
        await x.delay(100);

        background_placeholder.style.opacity = 0; // eslint-disable-line no-param-reassign

    } catch (er) {
        err(er, 114);
    }
};
//< show one image after it fully loaded


//> show transparency background checkerboard
export const hide_background_placeholder = background_placeholder => {
    try {
        x.add_cls(background_placeholder, 'none');

    } catch (er) {
        err(er, 115);
    }
};
//< show transparency background checkerboard

export const change_background_to_background_error = action(background_obj => {
    background_obj.background = 'background_error.png'; // eslint-disable-line no-param-reassign
});

export const hide_loading_screen = action(() => {
    try {
        ob.show_loading_screen = false;
        mut.background_inner_w_2_mounts_with_background_placeholder_hidden = false;

    } catch (er) {
        err(er, 116);
    }
}); //> hide loading_screen when images loaded on options page load

export const load_theme_background_when_clicking_on_load_theme_background_btn = () => {
    try {
        analytics.send_btns_event('upload', 'load_theme_background');

        x.send_message_to_background_c({ message: 'get_theme_background', reinstall_even_if_theme_background_already_exist: true });

    } catch (er) {
        err(er, 273);
    }
};

export const mut = {
    backgrounds_loaded: 0,
    background_inner_w_2_mounts_with_background_placeholder_hidden: true,
};

export const ob = observable({
    show_loading_screen: true,
    css_counter_offset: 0,
});
