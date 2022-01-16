import { t } from '@loftyshaky/shared';
import { d_settings } from 'shared/internal';
import { d_background } from 'new_tab/internal';

we.runtime.onMessage.addListener(
    (msg: t.Msg): Promise<any> =>
        err_async(async () => {
            const msg_str: string = msg.msg;

            if (msg_str === 'update_background') {
                await d_settings.Main.i().set_from_storage();
                await d_background.BackgroundChange.i().update_background({
                    no_tr: true,
                });
            } else {
                await x.delay(10000);
            }

            return true;
        }, 'cnt_54374'),
);
