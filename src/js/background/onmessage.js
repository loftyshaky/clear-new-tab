import * as r from 'ramda';

import x from 'x';
import { db } from 'js/init_db';
import * as contains_permission from 'js/contains_permission';
import * as get_ms_left from 'js/get_ms_left';
import * as last_background_change_time from 'js/last_background_change_time';
import * as determine_theme_current_background from 'js/determine_theme_current_background';
import * as backgrounds from 'background/backgrounds';
import * as theme_background from 'background/theme_background';
import * as multiple from 'background/multiple';
import * as tabs from 'background/tabs';
import * as file_types from 'js/file_types';
import * as analytics from 'js/analytics';

browser.runtime.onMessage.addListener((message, sender, send_response) => {
    try {
        const msg = message.message;

        if (msg === 'check_if_analytics_enabled') {
            contains_permission.contains_permission(xcon.analytics_permissions)
                .then(analytics_enabled => {
                    send_response(analytics_enabled);

                }).catch(er => {
                    err(er, 267, null, true);
                });

        } else if (msg === 'get_background') { // set, preload images and get current image from new tab
            if (!multiple.mut.finished_running_get_next_background_once) {
                const f = backgrounds.mut.future_background ? () => Promise.resolve() : async () => backgrounds.preload_current_and_future_background('reload');

                f().then(async () => {
                    const ms_left = await get_ms_left.get_ms_left();
                    const ed_all = await eda();

                    if (ms_left < 0 && ed_all.change_interval != 1 && !ed_all.background_already_changed && ed_all.mode === 'multiple') { // eslint-disable-line eqeqeq
                        send_response(backgrounds.mut.future_background);

                    } else {
                        send_response(backgrounds.mut.current_background);
                    }

                }).catch(er => {
                    err(er, 226, null, true);
                });

            } else {
                send_response(backgrounds.mut.current_background);
            }

        } else if (msg === 'get_future_background') {
            send_response(backgrounds.mut.future_background);

            multiple.get_next_background();

        } else if (msg === 'preload_background') { // set, preload images and get current image from new tab
            backgrounds.preload_current_and_future_background('reload')
                .then(() => {
                    send_response();

                }).catch(er => {
                    err(er, 226, null, true);
                });

        } else if (msg === 'retrieve_backgrounds') { // get ready backgrounds.mut.backgrounds for use in new tab
            backgrounds.retrieve_backgrounds(send_response);

        } else if (msg === 'update_backgrounds_obj') { //< update backgrounds object when changing image specefic values
            const i = get_background_i_by_id(message.id);

            if (backgrounds.mut.backgrounds[i] && typeof backgrounds.mut.backgrounds[i][message.storage] !== 'undefined') {
                backgrounds.mut.backgrounds[i][message.storage] = message.val;
            }

            backgrounds.preload_current_and_future_background('reload')
                .then(() => {
                    send_response();

                }).catch(er => {
                    err(er, 225, null, true);
                });

        } else if (msg === 'get_background_obj_when_selecting_on_it') { // get image object by index when selecting it (= clicking on it)
            send_response(backgrounds.mut.backgrounds[message.i]);

        } else if (msg === 'get_id_of_background_to_add') { // get id of background to add on place of deleted background and remove background from backgrounds array
            const next_background_after_last_visible_background_id = r.ifElse(
                () => {
                    try {
                        return backgrounds.mut.backgrounds[message.next_background_after_last_visible_background_i];

                    } catch (er) {
                        err(er, 29, null, true);
                    }

                    return undefined;

                }, // if image exist
                () => {
                    try {
                        return backgrounds.mut.backgrounds[message.next_background_after_last_visible_background_i].id;

                    } catch (er) {
                        err(er, 30, null, true);
                    }

                    return undefined;
                },

                () => 'background_is_not_existing',
            )();

            backgrounds.mut.backgrounds.splice(message.background_to_delete_i, 1); // remove background from backgrounds array

            send_response({ next_background_after_last_visible_background_id });

        } else if (msg === 'get_theme_background') {
            theme_background.get_installed_theme_id()
                .then(theme_id => theme_background.get_theme_background(theme_id, message.reinstall_even_if_theme_background_already_exist, null, null, message.reload_call)).then(() => {
                    send_response();

                }).catch(er => {
                    err(er, 21, null, true);
                });

        } else if (msg === 'record_theme_beta_theme_id') {
            theme_background.mut.theme_beta_theme_id = message.theme_beta_theme_id;

            send_response();

        } else if (msg === 'get_backgrounds_arr') {
            send_response(backgrounds.mut.backgrounds);

        } else if (msg === 'empty_backgrounds_a') { // empty backgrounds.mut.backgrounds when deleting all images
            backgrounds.mut.backgrounds = [];

        } else if (msg === 'get_new_current_background_when_choosing_theme_mode') {
            ed('last_installed_theme_theme_id')
                .then(async last_installed_theme_theme_id => {
                    const new_current_background = await determine_theme_current_background.determine_theme_current_background(last_installed_theme_theme_id, backgrounds.mut.backgrounds);

                    send_response(new_current_background);

                }).catch(er => {
                    err(er, 22, null, true);
                });

        } else if (msg === 'get_ids_of_backgrounds_to_shift') { // send background_id_before_move, ids_of_backgrounds_to_move
            const background_id_before_move = get_background_id_by_i(message.all_backgrounds_background_i_before_move);
            const ids_of_backgrounds_to_move = [];

            loop_through_backgrounds_a_elms_that_need_to_be_moved(message.move_type, message.start_i, message.end_i, i => {
                ids_of_backgrounds_to_move.push(backgrounds.mut.backgrounds[i].id);
            });

            send_response({ background_id_before_move, ids_of_backgrounds_to_move });

        } else if (msg === 'start_timer') {
            multiple.start_timer(true);

        } else if (msg === 'reset_timer') { // when changing change_interval or selecting image
            multiple.clear_timer();
            last_background_change_time.update_last_background_change_time();

            const at_least_one_new_tab_tab_opened = tabs.mut.new_tabs_ids.length > 0;

            if (at_least_one_new_tab_tab_opened) {
                multiple.start_timer();

            } else {
                db.ed.update(1, { background_already_changed: true });
            }

        } else if (msg === 'load_backgrounds') { // when repairing extension from database wipe
            backgrounds.load_backgrounds()
                .then(() => {
                    send_response();

                }).catch(er => {
                    err(er, 23, null, true);
                });

        } else if (msg === 'check_if_uploading_theme_background') { // install theme when clicking on "Install theme" button in chrome web store (firefox only)
            send_response(theme_background.mut.uploading_theme_background);

        } else if (msg === 'install_theme') { // install theme when clicking on "Install theme" button in chrome web store (firefox only)
            theme_background.get_theme_background(message.theme_id, true, message.tab_id)
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
            ed('last_installed_theme_beta_theme_id').then(last_installed_theme_beta_theme_id => {
                send_response(last_installed_theme_beta_theme_id);

            }).catch(er => {
                err(er, 26, null, true);
            });

        } else if (msg === 'send_install_theme_event') { // when installing theme (firefox only)
            analytics.send_event(message.install_src, message.action);

        } else if (msg === 'hide_undo_btn') { // hide undo button in all tabs
            x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'hide_undo_btn' }]).then(() => {
                send_response();

            }).catch(er => {
                err(er, 289, null, true);
            });

        } else if (msg === 'open_preview_background_tab') { // open image (new tab) by click on "Preview" button
            let new_tab_url;

            if (env.what_browser === 'chrome') {
                new_tab_url = `chrome://newtab?preview_background_id=${message.background_id}`;

            } else if (env.what_browser === 'firefox') {
                new_tab_url = browser.runtime.getURL(`/new_tab.html?preview_background_id=${message.background_id}`);
            }

            browser.tabs.create({
                url: new_tab_url,
            });

        } else if (msg === 'get_preview_background') { // send background_id_before_move, ids_of_backgrounds_to_move
            const background_i = get_background_i_by_id(message.background_id);
            const preview_background = r.clone(backgrounds.mut.backgrounds[background_i]);

            db.backgrounds.get(message.background_id)
                .then(background => {
                    if (file_types.con.files[preview_background.type]) {
                        preview_background.background = URL.createObjectURL(background.background);

                        send_response(preview_background);

                        setTimeout(revoke_preview_background.bind(null, preview_background.background), 10000);

                    } else {
                        send_response(preview_background);
                    }

                }).catch(er => {
                    err(er, 227, null, true);
                });
        }

    } catch (er) {
        err(er, 20, null, true);
    }

    return true; // without this callback of sendMessage function fires without waiting for async operation completion
});

//> functions used in onMessage above
const get_background_i_by_id = id => {
    try {
        return backgrounds.mut.backgrounds.findIndex(background => background.id === id);

    } catch (er) {
        err(er, 27, null, true);
    }

    return undefined;
};

const get_background_id_by_i = i => {
    try {
        return backgrounds.mut.backgrounds[i].id;

    } catch (er) {
        err(er, 28, null, true);
    }

    return undefined;
};

const loop_through_backgrounds_a_elms_that_need_to_be_moved = (move_type, start_i, end_i, callback) => {
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

const revoke_preview_background = preview_background_url => {
    try {
        URL.revokeObjectURL(preview_background_url);

    } catch (er) {
        err(er, 32, null, true);
    }
};
//< functions used in onMessage above
