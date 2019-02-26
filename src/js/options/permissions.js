import { toJS } from 'mobx';

import x from 'x';
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
        const cannot_uncheck_checkboxes = ['allow_downloading_images_by_link', 'enable_analytics'];

        if (!inputs_data.obj.other_settings[checkbox_name].val) { // if permission is NOT present
            analytics.send_permissions_event('requested', checkbox_name);

            const allowed = await request_permission(permissions);

            if (allowed) {
                analytics.send_permissions_event('allowed', checkbox_name);

                settings.change_input_val('other_settings', checkbox_name, true);

                if (checkbox_name === 'enable_analytics') {
                    analytics_privacy.allow_analytics();
                }

            } else {
                analytics.send_permissions_event('denied', checkbox_name);
            }

        } else if (cannot_uncheck_checkboxes.indexOf(checkbox_name) === -1 || what_browser === 'firefox') { // if permission is present
            analytics.send_permissions_event('removed', checkbox_name);

            await remove_permission(permissions);

            settings.change_input_val('other_settings', checkbox_name, false);

        } else {
            analytics.send_alerts_event(`cannot_disable_permission-${checkbox_name}`);

            window.alert(x.msg('cannot_disable_permission_alert'));
        }

        inputs_hiding.decide_what_inputs_to_hide();

    } catch (er) {
        err(er, 140);
    }
};

export const restore_optional_permissions_checkboxes_state = () => {
    try {
        const checkbox_names = ['show_bookmarks_bar', 'enable_paste', 'allow_downloading_images_by_link', 'enable_analytics'];
        const permissions = toJS(checkbox_names.map(checkbox_name => toJS(inputs_data.obj.other_settings[checkbox_name].permissions)));

        checkbox_names.forEach(async (checkbox_name, i) => {
            try {
                const contains = await contains_permission.contains_permission(permissions[i]);

                if (contains) {
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
