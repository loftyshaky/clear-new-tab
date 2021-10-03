import { t } from '@loftyshaky/shared';
import { s_data } from 'background/internal';

we.runtime.onMessage.addListener(
    (msg: t.Msg): Promise<any> =>
        err_async(async () => {
            const msg_str: string = msg.msg;

            if (msg_str === 'update_settings') {
                await s_data.Main.i().update_settings_debounce(msg.settings, msg.rerun_actions);
            } else if (msg_str === 'get_defaults') {
                return s_data.Main.i().defaults;
            }

            return true;
        }, 'cnt_1017'),
);
