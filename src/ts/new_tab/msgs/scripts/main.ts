import '@loftyshaky/shared/ext';
import { t, d_settings } from '@loftyshaky/shared/shared';
import { d_background, s_custom_code } from 'new_tab/internal';

we.runtime.onMessage.addListener((msg: t.Msg): any =>
    err(() => {
        const msg_str: string = msg.msg;

        if (msg_str === 'update_background') {
            if (!document.hidden || msg.force_update) {
                return d_settings.Main.i()
                    .set_from_storage()
                    .then(() =>
                        d_background.BackgroundChange.i().update_background({
                            no_tr: document.hidden ? true : msg.no_tr,
                            force_update: msg.force_update,
                        }),
                    )
                    .then(() => true)
                    .catch((error_obj: any) => show_err_ribbon(error_obj, 'cnt_1499'));
            }

            return Promise.resolve(true);
        }

        if (['load_settings', 'update_settings_new_tab'].includes(msg_str)) {
            return d_settings.Main.i()
                .set_from_storage()
                .then(() => true)
                .catch((error_obj: any) => show_err_ribbon(error_obj, 'cnt_1500'));
        }

        if (msg_str === 'set_custom_code') {
            return s_custom_code.Msgs.i()
                .send_set_custom_code_msg()
                .then(() => true)
                .catch((error_obj: any) => show_err_ribbon(error_obj, 'cnt_1501'));
        }

        if (msg_str === 'confirm_this_tab_is_new_tab_or_settings_page') {
            return Promise.resolve(true);
        }

        return false;
    }, 'cnt_1079'),
);
