//> check for x permissions t

//> request_permission f

//> remove_permission f

//> ask_for_permission_or_remove_it f

//> restore_optional_permissions_checkboxes_state f

//> set_val_of_permission_checkbox f

//> varibles t

//^

'use strict';

import x from 'x';
import * as shared_o from 'options/shared_o';

import { observable, action, configure } from "mobx";

configure({ enforceActions: true });

//> check for x permissions t
export const contains_permission = permissions => { // ex: await contains_permission([{'permissions': ['clipboardRead'] }]);
    return new Promise((resolve, reject) => {
        browser.permissions.contains(...permissions, result => {
            if (browser.runtime.lastError) {
                reject(browser.runtime.lastError);

            } else {
                resolve(result);
            }
        });
    });
};
//< check for x permissions t

//> request_permission f
const request_permission = permissions => {
    return new Promise((resolve, reject) => {
        browser.permissions.request(...permissions, result => {
            if (browser.runtime.lastError) {
                reject(browser.runtime.lastError);

            } else {
                resolve(result);
            }
        });
    });
};
//< request_permission f

//> remove_permission f
const remove_permission = permissions => {
    return new Promise((resolve, reject) => {
        browser.permissions.remove(...permissions, result => {
            if (browser.runtime.lastError) {
                reject(browser.runtime.lastError);

            } else {
                resolve(result);
            }
        });
    });
};
//< remove_permission f

//> ask_for_permission_or_remove_it f
export const ask_for_permission_or_remove_it = async (checkbox_name, permissions) => {
    try {

        if (!ob.optional_permissions_checkboxes[checkbox_name]) { // if permission is NOT present
            const granted = await request_permission(permissions);

            if (granted) {
                set_val_of_permission_checkbox(checkbox_name, true);
            }

        } else { // if permission is present
            if (checkbox_name != 'allow_downloading_images_by_link' || what_browser == 'firefox') {
                await remove_permission(permissions);

                set_val_of_permission_checkbox(checkbox_name, false);

            } else {
                alert(x.message('cannot_disable_all_urls_permission_alert'));
            }
        }

        shared_o.decide_what_input_items_to_hide();

    } catch (er) {
        console.error(er);
    }
};
//< ask_for_permission_or_remove_it f

//> restore_optional_permissions_checkboxes_state f
export const restore_optional_permissions_checkboxes_state = () => {
    const checkbox_names = ['show_bookmarks_bar', 'enable_paste', 'allow_downloading_images_by_link'];
    const permissions = checkbox_names.map((checkbox_name) => permissions_dict[checkbox_name]);

    checkbox_names.forEach(async (checkbox_name, i) => {
        try {
            const contains = await contains_permission(permissions[i]);

            contains ? set_val_of_permission_checkbox(checkbox_name, true) : set_val_of_permission_checkbox(checkbox_name, false);

        } catch (er) {
            console.error(er);
        }
    });
};
//< restore_optional_permissions_checkboxes_state f

//> set_val_of_permission_checkbox f
const set_val_of_permission_checkbox = action(function (checkbox_name, val) {
    ob.optional_permissions_checkboxes[checkbox_name] = val;
});
//< set_val_of_permission_checkbox f

//> varibles t
export const permissions_dict = {
    show_bookmarks_bar: [{ 'permissions': ['bookmarks'] }], // 'origins': ['chrome://favicon/'] 
    enable_paste: [{ 'permissions': ['clipboardRead'] }],
    allow_downloading_images_by_link: [{ 'origins': ['*://*/*'] }]
};

export const ob = observable({
    optional_permissions_checkboxes: {}
});
//< varibles t