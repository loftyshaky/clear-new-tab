import * as r from 'ramda';

import x from 'x';
import { db } from 'js/init_db';
import * as shared_b from 'background/shared_b';
import * as theme_img from 'background/theme_img';
import * as multiple from 'background/multiple';
import * as tabs from 'background/tabs';
import * as determine_theme_current_img from 'js/determine_theme_current_img';

const get_img_i_by_id = id => shared_b.mut.imgs.findIndex(img => img.id === id);

const get_img_id_by_i = i => shared_b.mut.imgs[i].id;

const loop_through_imgs_a_elms_that_need_to_be_moved = (move_type, start_i, end_i, callback) => {
    if (move_type === 'forward') {
        for (let i = start_i; i <= end_i; i++) {
            callback(i, -1);
        }

    } else if (move_type === 'backward') {
        for (let i = start_i; i >= end_i; i--) {
            callback(i, 1);
        }
    }
};

const revoke_preview_img = preview_img_url => {
    URL.revokeObjectURL(preview_img_url);
};

//> recieve messages
browser.runtime.onMessage.addListener((message, sender, send_response) => {
    const msg = message.message;

    if (msg === 'get_img') { // set, preload images and get current image from new tab
        send_response(shared_b.mut.current_img);

    } else if (msg === 'get_future_img') {
        send_response(shared_b.mut.future_img);

        multiple.get_next_img();

    } else if (msg === 'preload_img') { // set, preload images and get current image from new tab
        shared_b.preload_current_and_future_img('reload');
        send_response();

    } else if (msg === 'retrieve_imgs') { // get ready shared_b.mut.imgs for use in new tab
        shared_b.retrieve_imgs(send_response);

    } else if (msg === 'update_imgs_obj') { //< update imgs object when changing image specefic values
        const i = get_img_i_by_id(message.id);

        if (shared_b.mut.imgs[i] && shared_b.mut.imgs[i][message.storage]) {
            shared_b.mut.imgs[i][message.storage] = message.val;
        }

    } else if (msg === 'get_img_obj_when_selecting_on_it') { // get image object by index when selecting it (= clicking on it)
        send_response(shared_b.mut.imgs[message.i]);

    } else if (msg === 'get_id_of_img_to_add') { // get id of image to add on place of deleted image and remove image from imgs array
        const next_img_after_last_visible_img_id = r.ifElse(() => shared_b.mut.imgs[message.next_img_after_last_visible_img_i], // if image exist
            () => shared_b.mut.imgs[message.next_img_after_last_visible_img_i].id,

            () => 'img_not_existing')();

        shared_b.mut.imgs.splice(message.img_to_delete_i, 1); // remove img from imgs array

        send_response({ next_img_after_last_visible_img_id });

    } else if (msg === 'get_theme_img') {
        shared_b.get_installed_theme_id()
            .then(theme_id => theme_img.get_theme_img(theme_id, message.reinstall_even_if_theme_img_already_exist)).then(() => {
                send_response();

            }).catch(er => {
                console.error(er);
            });

    } else if (msg === 'get_imgs_arr') {
        send_response(shared_b.mut.imgs);

    } else if (msg === 'empty_imgs_a') { // empty shared_b.mut.imgs when deleting all images
        shared_b.mut.imgs = [];

    } else if (msg === 'get_new_current_img_when_choosing_theme_mode') {
        ed123('last_installed_theme_theme_id')
            .then(last_installed_theme_theme_id => determine_theme_current_img.determine_theme_current_img(last_installed_theme_theme_id, shared_b.mut.imgs))
            .then(new_current_img => {
                send_response(new_current_img);

            }).catch(er => {
                console.error(er);
            });

    } else if (msg === 'get_ids_of_imgs_to_shift') { // send img_id_before_drop, ids_of_imgs_to_move
        const img_id_before_drop = get_img_id_by_i(message.img_i_before_drop);
        const ids_of_imgs_to_move = [];

        loop_through_imgs_a_elms_that_need_to_be_moved(message.move_type, message.start_i, message.end_i, i => {
            ids_of_imgs_to_move.push(shared_b.mut.imgs[i].id);
        });

        send_response({ img_id_before_drop, ids_of_imgs_to_move });

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
        shared_b.load_imgs()
            .then(() => {
                send_response();

            }).catch(er => {
                console.error(er);
            });

    } else if (msg === 'install_theme') { // install theme when clicking on "Install theme" button in chrome web store (firefox only)
        theme_img.get_theme_img(message.theme_id, true, message.tab_id)
            .then(response => {
                send_response(response);

            }).catch(er => {
                console.error(er);
            });

    } else if (msg === 'get_current_tab_id') { // when installing theme (firefox only)
        browser.tabs.query({ currentWindow: true, active: true }, tabs_ => {
            send_response(tabs_[0].id);
        });

    } else if (msg === 'get_last_installed_theme_theme_id') { // when installing theme (firefox only)
        ed123('last_installed_theme_theme_id').then(last_installed_theme_theme_id => {
            send_response(last_installed_theme_theme_id);

        }).catch(er => {
            console.error(er);
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

    } else if (msg === 'get_preview_img') { // send img_id_before_drop, ids_of_imgs_to_move
        const img_i = get_img_i_by_id(message.img_id);
        const preview_img = r.clone(shared_b.mut.imgs[img_i]);

        if (preview_img.type.indexOf('file') > -1) {
            preview_img.img = URL.createObjectURL(preview_img.img);

            send_response(preview_img);

            setTimeout(revoke_preview_img.bind(null, preview_img.img), 10000);
        }
    }

    return true; // without this callback of sendMessage function fires without waiting for async operation completion
});
//< recieve messages
