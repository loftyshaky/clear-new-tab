import { toJS } from 'mobx';

import { db } from 'js/init_db';
import * as analytics from 'js/analytics';
import * as contains_permission from 'js/contains_permission';
import * as analytics_privacy from 'options/analytics_privacy';
import { inputs_data } from 'options/inputs_data';
import * as settings from 'options/settings';
import * as inputs_hiding from 'options/inputs_hiding';

const request_permission = permissions => new Promise((resolve, reject) => {
    browser.permissions.request(...permissions, result => {
        if (browser.runtime.lastError) {
            reject(browser.runtime.lastError);

        } else {
            resolve(result);
        }
    });
});

export const remove_permission = permissions => new Promise((resolve, reject) => {
    browser.permissions.remove(...permissions, result => {
        if (browser.runtime.lastError) {
            reject(browser.runtime.lastError);

        } else {
            resolve(result);
        }
    });
});

export const ask_for_permission_or_remove_it = async (checkbox_name, permissions) => {
    try {
        const cannot_remove_permissions = ['allow_downloading_images_by_link', 'allow_analytics'];

        if (!inputs_data.obj.other_settings[checkbox_name].val) { // if permission is NOT present
            analytics.send_permissions_event('requested', checkbox_name);

            const allowed = await request_permission(permissions);

            if (allowed) {
                analytics.send_permissions_event('allowed', checkbox_name);

                db.ed.update(1, { [checkbox_name]: true });

                settings.change_input_val('other_settings', checkbox_name, true);

                if (checkbox_name === 'allow_analytics') {
                    analytics_privacy.allow_analytics();
                }

            } else {
                analytics.send_permissions_event('denied', checkbox_name);
            }

        } else { // if permission is present
            if (cannot_remove_permissions.indexOf(checkbox_name) === -1 || what_browser === 'firefox') {
                analytics.send_permissions_event('removed', checkbox_name);

                await remove_permission(permissions);
            }

            db.ed.update(1, { [checkbox_name]: false });

            settings.change_input_val('other_settings', checkbox_name, false);
        }

        inputs_hiding.decide_what_inputs_to_hide();

    } catch (er) {
        err(er, 140);
    }
};

export const restore_optional_permissions_checkboxes_state = () => {
    try {
        const checkbox_names = ['show_bookmarks_bar', 'enable_paste', 'allow_downloading_images_by_link', 'allow_analytics'];
        const permissions = toJS(checkbox_names.map(checkbox_name => toJS(inputs_data.obj.other_settings[checkbox_name].permissions)));

        checkbox_names.forEach(async (checkbox_name, i) => {
            try {
                const contains = await contains_permission.contains_permission(permissions[i]);
                const ed_val_is_true = await ed(checkbox_name);

                if (contains && ed_val_is_true) {
                    settings.change_input_val('other_settings', checkbox_name, true);

                } else {
                    settings.change_input_val('other_settings', checkbox_name, false);
                }

            } catch (er) {
                err(er, 142);
            }
        });

    } catch (er) {
        err(er, 141);
    }
};
