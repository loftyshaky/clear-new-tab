import { t } from '@loftyshaky/shared';
import { s_data, s_theme } from 'background/internal';

we.runtime.onMessage.addListener(
    (msg: t.Msg): Promise<any> =>
        err_async(async () => {
            const msg_str: string = msg.msg;

            if (msg_str === 'update_settings') {
                if (n(msg.update_instantly) && msg.update_instantly) {
                    s_data.Main.i().update_settings({ settings: msg.settings });
                } else {
                    s_data.Main.i().update_settings_debounce(msg.settings);
                }
            } else if (msg_str === 'get_defaults') {
                return s_data.Main.i().defaults;
            } else if (msg_str === 'reload_ext') {
                we.runtime.reload();
            } else if (msg_str === 'open_theme_background') {
                s_theme.LinkToImage.i().open();
            }

            return true;
        }, 'cnt_1017'),
);
