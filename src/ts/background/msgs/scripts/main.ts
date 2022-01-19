import { t } from '@loftyshaky/shared';
import { s_data, s_theme } from 'background/internal';

we.runtime.onMessage.addListener(
    (msg: t.Msg): Promise<any> =>
        err_async(async () => {
            const msg_str: string = msg.msg;

            if (msg_str === 'update_settings') {
                if (n(msg.update_instantly) && msg.update_instantly) {
                    await s_data.Main.i().update_settings({
                        settings: msg.settings,
                        update_background: msg.update_background,
                    });
                } else {
                    s_data.Main.i().update_settings_debounce(msg.settings, msg.update_background);
                }
            } else if (msg_str === 'get_defaults') {
                return s_data.Main.i().defaults;
            } else if (msg_str === 'open_theme_background') {
                s_theme.LinkToImage.i().open();
            } else {
                await x.delay(10000);
            }

            return true;
        }, 'cnt_1017'),
);
