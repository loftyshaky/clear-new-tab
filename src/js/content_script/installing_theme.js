import { observable, action, configure } from 'mobx';

import x from 'x';

configure({ enforceActions: 'observed' });

const download_theme = async (theme_id, show_undo_btn) => {
    try {
        const tab_id = await x.send_message_to_background_c({ message: 'get_current_tab_id' });
        const status = await x.send_message_to_background_c({ message: 'install_theme', theme_id, tab_id });

        const install_succeed = status === 'success';

        await x.send_message_to_background_c({ message: 'hide_undo_btn' });

        show_or_hide_undo_btn(show_undo_btn ? install_succeed : false);

    } catch (er) {
        err(er, 204);
    }
};

export const install_theme = async theme_id => {
    try {
        x.send_message_to_background({ message: 'send_install_theme_event', install_src: con.install_src, action: 'tried_to_install_theme' });

        if (con.install_src === 'cws') {
            const is_theme_install_screen = s('.e-f-n-Va');

            if (!is_theme_install_screen) {
                mut.cancel_theme_screen_opening = true;
            }

        }

        mut.previously_installed_theme_theme_id = await x.send_message_to_background_c({ message: 'get_last_installed_theme_theme_id' });

        if (con.install_src === 'cws') {
            await download_theme(theme_id, true);

        } else if (con.install_src === 'theme_beta') {
            await x.send_message_to_background_c({ message: 'record_theme_beta_theme_id', theme_beta_theme_id: theme_id });

            await download_theme(theme_id, true);
        }

    } catch (er) {
        err(er, 205);
    }
};

export const undo_theme = async theme_id => {
    try {
        x.send_message_to_background({ message: 'send_install_theme_event', install_src: con.install_src, action: 'tried_to_undo_theme' });

        show_or_hide_undo_btn(false);

        if (con.install_src === 'theme_beta') {
            await x.send_message_to_background_c({ message: 'record_theme_beta_theme_id', theme_beta_theme_id: theme_id });
        }

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

export const con = {
    install_src: window.location.hostname === 'chrome.google.com' ? 'cws' : 'theme_beta',
};

export const mut = {
    cancel_theme_screen_opening: false,
    previously_installed_theme_theme_id: null,
};

export const ob = observable({
    show_undo_btn: false,
});
