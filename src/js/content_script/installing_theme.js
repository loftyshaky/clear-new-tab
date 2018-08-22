//> download_theme f

//> install_theme f

//> download_theme f

//> show_or_hide_undo_btn f

//> varibles t

//^

'use strict';

import x from 'x';

import { observable, action, configure } from "mobx";

configure({ enforceActions: true });

//> download_theme f
const download_theme = async (theme_id, show_undo_btn) => {
    const tab_id = await x.send_message_to_background_c({ message: 'get_current_tab_id' });
    const status = await x.send_message_to_background_c({ message: 'install_theme', theme_id: theme_id, tab_id: tab_id });
    const install_succeed = status == 'success' ? true : false;

    show_or_hide_undo_btn(show_undo_btn ? install_succeed : false);
};
//< download_theme f

//> install_theme f
export const install_theme = async theme_id => {
    const is_theme_install_screen = s('.sf-f');

    if (!is_theme_install_screen) {
        mut.cancel_theme_screen_opening = true;
    }

    mut.previous_installed_theme_theme_id = await x.send_message_to_background_c({ message: 'get_last_installed_theme_theme_id' });

    await download_theme(theme_id, true);
};
//< install_theme f

//> download_theme f
export const undo_theme = async theme_id => {
    await download_theme(theme_id, false);
};
//< download_theme f

//> show_or_hide_undo_btn f
export const show_or_hide_undo_btn = action(bool => {
    ob.show_undo_btn = bool;
});
//< show_or_hide_undo_btn f

//> varibles t
export const mut = {
    cancel_theme_screen_opening: false,
    previous_installed_theme_theme_id: null
};

export const ob = observable({
    show_undo_btn: false
});
//< varibles t