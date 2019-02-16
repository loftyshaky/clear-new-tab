'use_strict';

import * as r from 'ramda';

import { db } from 'js/init_db';
import * as determine_theme_current_img from 'js/determine_theme_current_img';
import * as imgs from 'background/imgs';
import * as theme_img from 'background/theme_img';
import * as multiple from 'background/multiple';
import * as tabs from 'background/tabs';
import * as file_types from 'js/file_types';

browser.runtime.onMessage.addListener((message, sender, send_response) => {
    try {
        const msg = message.message;

        if (msg === 'get_img') { // set, preload images and get current image from new tab
            send_response(imgs.mut.current_img);

        } else if (msg === 'get_future_img') {
            send_response(imgs.mut.future_img);

            multiple.get_next_img();

        } else if (msg === 'preload_img') { // set, preload images and get current image from new tab
            imgs.preload_current_and_future_img('reload')
                .then(() => {
                    send_response();

                }).catch(er => {
                    err(er, 226, null, true);
                });

        } else if (msg === 'retrieve_imgs') { // get ready imgs.mut.imgs for use in new tab
            imgs.retrieve_imgs(send_response);

        } else if (msg === 'update_imgs_obj') { //< update imgs object when changing image specefic values
            const i = get_img_i_by_id(message.id);

            if (imgs.mut.imgs[i] && imgs.mut.imgs[i][message.storage]) {
                imgs.mut.imgs[i][message.storage] = message.val;
            }

            imgs.preload_current_and_future_img('reload')
                .then(() => {
                    send_response();

                }).catch(er => {
                    err(er, 225, null, true);
                });

        } else if (msg === 'get_img_obj_when_selecting_on_it') { // get image object by index when selecting it (= clicking on it)
            send_response(imgs.mut.imgs[message.i]);

        } else if (msg === 'get_id_of_img_to_add') { // get id of image to add on place of deleted image and remove image from imgs array
            const next_img_after_last_visible_img_id = r.ifElse(
                () => {
                    try {
                        return imgs.mut.imgs[message.next_img_after_last_visible_img_i];

                    } catch (er) {
                        err(er, 29, null, true);
                    }

                    return undefined;

                }, // if image exist
                () => {
                    try {
                        return imgs.mut.imgs[message.next_img_after_last_visible_img_i].id;

                    } catch (er) {
                        err(er, 30, null, true);
                    }

                    return undefined;
                },

                () => 'img_not_existing',
            )();

            imgs.mut.imgs.splice(message.img_to_delete_i, 1); // remove img from imgs array

            send_response({ next_img_after_last_visible_img_id });

        } else if (msg === 'get_theme_img') {
            theme_img.get_installed_theme_id()
                .then(theme_id => theme_img.get_theme_img(theme_id, message.reinstall_even_if_theme_img_already_exist)).then(() => {
                    send_response();

                }).catch(er => {
                    err(er, 21, null, true);
                });

        } else if (msg === 'get_imgs_arr') {
            send_response(imgs.mut.imgs);

        } else if (msg === 'empty_imgs_a') { // empty imgs.mut.imgs when deleting all images
            imgs.mut.imgs = [];

        } else if (msg === 'get_new_current_img_when_choosing_theme_mode') {
            ed('last_installed_theme_theme_id')
                .then(last_installed_theme_theme_id => determine_theme_current_img.determine_theme_current_img(last_installed_theme_theme_id, imgs.mut.imgs))
                .then(new_current_img => {
                    send_response(new_current_img);

                }).catch(er => {
                    err(er, 22, null, true);
                });

        } else if (msg === 'get_ids_of_imgs_to_shift') { // send img_id_before_move, ids_of_imgs_to_move
            const img_id_before_move = get_img_id_by_i(message.all_imgs_img_i_before_move);
            const ids_of_imgs_to_move = [];

            loop_through_imgs_a_elms_that_need_to_be_moved(message.move_type, message.start_i, message.end_i, i => {
                ids_of_imgs_to_move.push(imgs.mut.imgs[i].id);
            });

            send_response({ img_id_before_move, ids_of_imgs_to_move });

        } else if (msg === 'start_timer') {
            multiple.start_timer(true);

        } else if (msg === 'reset_timer') { // when changing change_interval or selecting image
            multiple.clear_timer();
            multiple.update_last_img_change_time_f();

            const at_least_one_new_tab_tab_opened = tabs.mut.new_tabs_ids.length > 0;

            if (at_least_one_new_tab_tab_opened) {
                multiple.start_timer();

            } else {
                db.ed.update(1, { img_already_changed: true });
            }

        } else if (msg === 'load_imgs') { // when repairing extension from database wipe
            imgs.load_imgs()
                .then(() => {
                    send_response();

                }).catch(er => {
                    err(er, 23, null, true);
                });

        } else if (msg === 'install_theme') { // install theme when clicking on "Install theme" button in chrome web store (firefox only)
            theme_img.get_theme_img(message.theme_id, true, message.tab_id)
                .then(response => {
                    send_response(response);

                }).catch(er => {
                    err(er, 24, null, true);
                });

        } else if (msg === 'get_current_tab_id') { // when installing theme (firefox only)
            browser.tabs.query({ currentWindow: true, active: true }, tabs_ => {
                try {
                    send_response(tabs_[0].id);

                } catch (er) {
                    err(er, 25, null, true);
                }
            });

        } else if (msg === 'get_last_installed_theme_theme_id') { // when installing theme (firefox only)
            ed('last_installed_theme_theme_id').then(last_installed_theme_theme_id => {
                send_response(last_installed_theme_theme_id);

            }).catch(er => {
                err(er, 26, null, true);
            });

        } else if (msg === 'open_preview_img_tab') { // open image (new tab) by click on "Preview" button
            let new_tab_url;

            if (what_browser === 'chrome') {
                new_tab_url = `chrome://newtab?preview_img_id=${message.img_id}`;

            } else if (what_browser === 'firefox') {
                new_tab_url = browser.runtime.getURL(`/new_tab.html?preview_img_id=${message.img_id}`);
            }

            browser.tabs.create({
                url: new_tab_url,
            });

        } else if (msg === 'get_preview_img') { // send img_id_before_move, ids_of_imgs_to_move
            const img_i = get_img_i_by_id(message.img_id);
            const preview_img = r.clone(imgs.mut.imgs[img_i]);

            if (file_types.con.files[preview_img.type]) {
                preview_img.img = URL.createObjectURL(preview_img.img);

                send_response(preview_img);

                setTimeout(revoke_preview_img.bind(null, preview_img.img), 10000);

            } else {
                send_response(preview_img);
            }
        }

    } catch (er) {
        err(er, 20, null, true);
    }

    return true; // without this callback of sendMessage function fires without waiting for async operation completion
});

//> functions used in onMessage above
const get_img_i_by_id = id => {
    try {
        return imgs.mut.imgs.findIndex(img => img.id === id);

    } catch (er) {
        err(er, 27, null, true);
    }

    return undefined;
};

const get_img_id_by_i = i => {
    try {
        return imgs.mut.imgs[i].id;

    } catch (er) {
        err(er, 28, null, true);
    }

    return undefined;
};

const loop_through_imgs_a_elms_that_need_to_be_moved = (move_type, start_i, end_i, callback) => {
    try {
        if (move_type === 'forward') {
            for (let i = start_i; i <= end_i; i++) {
                callback(i, -1);
            }

        } else if (move_type === 'backward') {
            for (let i = start_i; i >= end_i; i--) {
                callback(i, 1);
            }
        }

    } catch (er) {
        err(er, 31, null, true);
    }
};

const revoke_preview_img = preview_img_url => {
    try {
        URL.revokeObjectURL(preview_img_url);

    } catch (er) {
        err(er, 32, null, true);
    }
};
//< functions used in onMessage above
