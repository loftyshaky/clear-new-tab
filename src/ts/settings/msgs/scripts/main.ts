import { t } from '@loftyshaky/shared';
import { d_settings } from 'shared/internal';
import { d_backgrounds } from 'settings/internal';

we.runtime.onMessage.addListener(
    (msg: t.Msg): Promise<any> =>
        err_async(async () => {
            const msg_str: string = msg.msg;

            if (msg_str === 'update_settings_page_settings_obj') {
                await d_settings.Main.i().set_from_storage();
            } else if (msg_str === 'set_current_background_i') {
                await d_settings.Main.i().set_from_storage();
                d_backgrounds.CurrentBackground.i().set_current_background_i();
            } else {
                await x.delay(10000);
            }

            return true;
        }, 'cnt_54374'),
);
