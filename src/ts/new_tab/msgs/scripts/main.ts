import { t } from '@loftyshaky/shared';
import { d_settings } from 'shared/internal';
import { d_background, s_service_worker } from 'new_tab/internal';

we.runtime.onMessage.addListener(
    (msg: t.Msg): Promise<any> =>
        err_async(async () => {
            const msg_str: string = msg.msg;

            if (msg_str === 'connect') {
                s_service_worker.Lifeline.i().connect();
            } else if (msg_str === 'disconnect') {
                s_service_worker.Lifeline.i().disconnect();
            } else if (msg_str === 'update_background') {
                await d_settings.Main.i().set_from_storage();
                await d_background.BackgroundChange.i().update_background({
                    no_tr: document.hidden ? true : msg.no_tr,
                    force_update: msg.force_update,
                });
            } else if (msg_str === 'update_settings_new_tab') {
                await d_settings.Main.i().set_from_storage();
            } else {
                await x.delay(10000);
            }

            return true;
        }, 'cnt_54374'),
);
