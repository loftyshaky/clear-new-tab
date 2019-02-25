'use_strict';

import { observable, action, configure } from 'mobx';

import x from 'x';
import * as analytics from 'js/analytics';

configure({ enforceActions: 'observed' });

const download_theme = async (theme_id, show_undo_btn) => {
    try {
        const tab_id = await x.send_message_to_background_c({ message: 'get_current_tab_id' });
        const status = await x.send_message_to_background_c({ message: 'install_theme', theme_id, tab_id });

        const install_succeed = status === 'success';

        show_or_hide_undo_btn(show_undo_btn ? install_succeed : false);

    } catch (er) {
        err(er, 204);
    }
};

export const install_theme = async theme_id => {
    try {
        analytics.send_event('cws', 'tried_to_install_theme');

        const is_theme_install_screen = s('.sf-f');

        if (!is_theme_install_screen) {
            mut.cancel_theme_screen_opening = true;
        }

        mut.previous_installed_theme_theme_id = await x.send_message_to_background_c({ message: 'get_last_installed_theme_theme_id' });

        await download_theme(theme_id, true);

    } catch (er) {
        err(er, 205);
    }
};

export const undo_theme = async theme_id => {
    try {
        analytics.send_event('cws', 'tried_to_undo_theme');

        await download_theme(theme_id, false);

    } catch (er) {
        err(er, 206);
    }
};

export const show_or_hide_undo_btn = action(bool => {
    try {
        ob.show_undo_btn = bool;

    } catch (er) {
        err(er, 207);
    }
});

export const mut = {
    cancel_theme_screen_opening: false,
    previous_installed_theme_theme_id: null,
};

export const ob = observable({
    show_undo_btn: false,
});
