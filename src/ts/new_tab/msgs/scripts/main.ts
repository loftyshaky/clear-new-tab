import { t } from '@loftyshaky/shared';
import { d_settings } from 'shared/internal';
import { d_background } from 'new_tab/internal';

we.runtime.onMessage.addListener(
    (msg: t.Msg): Promise<any> =>
        err_async(async () => {
            const msg_str: string = msg.msg;

            if (msg_str === 'update_new_tab_page_settings_obj') {
                await d_settings.Main.i().set_from_storage();
            } else if (msg_str === 'update_background_data') {
                await d_settings.Main.i().set_from_storage();
                await d_background.Main.i().update_background();
            }

            return true;
        }, 'cnt_54374'),
);
