import { t, d_settings } from '@loftyshaky/shared';
import { d_backgrounds, d_scheduler, s_browser_theme } from 'settings/internal';

we.runtime.onMessage.addListener(
    (msg: t.Msg): Promise<any> =>
        err_async(async () => {
            const msg_str: string = msg.msg;

            if (['load_settings', 'update_settings_settings'].includes(msg_str)) {
                await d_settings.Main.i().set_from_storage();
            } else if (msg_str === 'set_current_background_i') {
                await d_settings.Main.i().set_from_storage();
                d_backgrounds.CurrentBackground.i().set_current_background_i();
            } else if (msg_str === 'set_current_background_id_to_id_of_first_background') {
                // eslint-disable-next-line max-len
                await d_backgrounds.CurrentBackground.i().set_current_background_id_to_id_of_first_background();
            } else if (msg_str === 'try_to_get_theme_background') {
                s_browser_theme.Main.i().try_to_get_theme_background();
            } else if (msg_str === 'update_tasks') {
                await d_scheduler.Tasks.i().set_tasks();
            } else {
                await x.delay(10000);
            }

            return true;
        }, 'cnt_1224'),
);
