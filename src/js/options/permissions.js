import { toJS } from 'mobx';

import x from 'x';
import { inputs_data } from 'options/inputs_data';
import * as shared_o from 'options/shared_o';

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
                shared_o.change_input_val('other_settings', checkbox_name, true);
            }

        } else if (checkbox_name !== 'allow_downloading_images_by_link' || what_browser === 'firefox') { // if permission is present
            await remove_permission(permissions);

            shared_o.change_input_val('other_settings', checkbox_name, false);

        } else {
            alert(x.msg('cannot_disable_all_urls_permission_alert'));
        }

        shared_o.decide_what_inputs_to_hide();

    } catch (er) {
        console.error(er);
    }
};

export const restore_optional_permissions_checkboxes_state = () => {
    const checkbox_names = ['show_bookmarks_bar', 'enable_paste', 'allow_downloading_images_by_link'];
    const permissions = toJS(checkbox_names.map(checkbox_name => toJS(inputs_data.obj.other_settings[checkbox_name].permissions)));

    checkbox_names.forEach(async (checkbox_name, i) => {
        try {
            const contains = await contains_permission(permissions[i]);

            if (contains) {
                shared_o.change_input_val('other_settings', checkbox_name, true);

            } else {
                shared_o.change_input_val('other_settings', checkbox_name, false);
            }

        } catch (er) {
            console.error(er);
        }
    });
};
