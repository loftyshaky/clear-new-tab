import '@loftyshaky/shared/ext';
import { d_data } from '@loftyshaky/shared/shared';
import type { i_error, t } from '@loftyshaky/shared/shared_clean';
import { d_background, s_custom_code } from 'new_tab/internal';

we.runtime.onMessage.addListener(
    (msg: t.Any): t.Any =>
        err(() => {
            const msg_str: string = msg.msg;

            if (msg_str === 'update_background') {
                if (!document.hidden || msg.force_update) {
                    return d_data.Settings.set_from_storage({ settings: msg.settings })
                        .then(() =>
                            d_background.BackgroundChange.update_background({
                                no_tr: document.hidden ? true : msg.no_tr,
                                force_update: msg.force_update,
                            }),
                        )
                        .then(() => true)
                        .catch((error_obj: i_error.ErrorObj) =>
                            show_err_ribbon(error_obj, 'cnt_1499'),
                        );
                }

                return Promise.resolve(true);
            }

            if (['load_settings', 'update_settings_new_tab'].includes(msg_str)) {
                return d_data.Settings.set_from_storage()
                    .then(() => true)
                    .catch((error_obj: i_error.ErrorObj) => show_err_ribbon(error_obj, 'cnt_1500'));
            }

            if (msg_str === 'set_custom_code') {
                return s_custom_code.Msgs.send_set_custom_code_msg()
                    .then(() => true)
                    .catch((error_obj: i_error.ErrorObj) => show_err_ribbon(error_obj, 'cnt_1501'));
            }

            if (msg_str === 'confirm_this_tab_is_new_tab_or_settings_page') {
                return Promise.resolve(true);
            }

            if (msg_str === 'confirm_this_tab_is_new_tab_page') {
                return Promise.resolve(true);
            }

            return false;
        }, 'cnt_1079'),
);
