import '@loftyshaky/shared/ext';
import { t, d_settings } from '@loftyshaky/shared';
import { d_background, s_custom_code } from 'new_tab/internal';

we.runtime.onMessage.addListener(
    (msg: t.Msg): Promise<any> =>
        err_async(async () => {
            const msg_str: string = msg.msg;

            if (msg_str === 'update_background') {
                if (!document.hidden || msg.force_update) {
                    await d_settings.Main.i().set_from_storage();
                    await d_background.BackgroundChange.i().update_background({
                        no_tr: document.hidden ? true : msg.no_tr,
                        force_update: msg.force_update,
                    });
                }
            } else if (['load_settings', 'update_settings_new_tab'].includes(msg_str)) {
                await d_settings.Main.i().set_from_storage();
            } else if (msg_str === 'set_custom_code') {
                await s_custom_code.Msgs.i().send_set_custom_code_msg();
            } else {
                await x.delay(10000);
            }

            return true;
        }, 'cnt_1079'),
);
