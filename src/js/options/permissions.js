
'use_strict';

import { toJS } from 'mobx';

import x from 'x';
import { inputs_data } from 'options/inputs_data';
import * as settings from 'options/settings';
import * as inputs_hiding from 'options/inputs_hiding';

//> check for x permissions
export const contains_permission = permissions => new Promise((resolve, reject) => { // ex: await contains_permission([{'permissions': ['clipboardRead'] }]);
    browser.permissions.contains(...permissions, result => {
        if (browser.runtime.lastError) {
            reject(browser.runtime.lastError);

        } else {
            resolve(result);
        }
    });
});
//< check for x permissions

const request_permission = permissions => new Promise((resolve, reject) => {
    browser.permissions.request(...permissions, result => {
        if (browser.runtime.lastError) {
            reject(browser.runtime.lastError);

        } else {
            resolve(result);
        }
    });
});

const remove_permission = permissions => new Promise((resolve, reject) => {
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
        if (!inputs_data.obj.other_settings[checkbox_name].val) { // if permission is NOT present
            const granted = await request_permission(permissions);

            if (granted) {
                settings.change_input_val('other_settings', checkbox_name, true);
            }

        } else if (checkbox_name !== 'allow_downloading_images_by_link' || what_browser === 'firefox') { // if permission is present
            await remove_permission(permissions);

            settings.change_input_val('other_settings', checkbox_name, false);

        } else {
            window.alert(x.msg('cannot_disable_all_urls_permission_alert'));
        }

        inputs_hiding.decide_what_inputs_to_hide();

    } catch (er) {
        err(er, 140);
    }
};

export const restore_optional_permissions_checkboxes_state = () => {
    try {
        const checkbox_names = ['show_bookmarks_bar', 'enable_paste', 'allow_downloading_images_by_link'];
        const permissions = toJS(checkbox_names.map(checkbox_name => toJS(inputs_data.obj.other_settings[checkbox_name].permissions)));

        checkbox_names.forEach(async (checkbox_name, i) => {
            try {
                const contains = await contains_permission(permissions[i]);

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
