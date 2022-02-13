import { t } from '@loftyshaky/shared';
import { s_background, s_data } from 'shared/internal';
import { s_tabs, s_theme } from 'background/internal';

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
            } else if (msg_str === 'push_tab_id') {
                s_tabs.TabIds.i().push_tab_id();
            } else if (msg_str === 'get_background') {
                s_background.BackgroundChange.i().try_to_change_background();
            } else if (msg_str === 'clear_slideshow_timer') {
                s_background.BackgroundChange.i().clear_slideshow_timer();
            } else if (msg_str === 'open_theme_background') {
                s_theme.LinkToImage.i().open();
            } else {
                await x.delay(10000);
            }

            return true;
        }, 'cnt_1017'),
);
