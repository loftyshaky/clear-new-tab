import { t } from '@loftyshaky/shared';
import { s_backgrounds } from 'offscreen/internal';

we.runtime.onMessage.addListener(
    (msg: t.Msg): Promise<any> =>
        err_async(async () => {
            const msg_str: string = msg.msg;

            if (msg_str === 'set_current_background_data') {
                await s_backgrounds.CurrentBackground.i().set_current_background_data({
                    current_background_id: msg.current_background_id,
                    force: n(msg.force) ? msg.force : false,
                });
            } else if (msg_str === 'get_preloaded_background_data') {
                await s_backgrounds.CurrentBackground.i().set_current_background_data_from_empty({
                    current_background_id: msg.current_background_id,
                });

                return {
                    current_background: s_backgrounds.CurrentBackground.i().current_background,
                    current_background_file:
                        s_backgrounds.CurrentBackground.i().current_background_file,
                };
            } else {
                await x.delay(10000);
            }

            return true;
        }, 'cnt_1474'),
);
