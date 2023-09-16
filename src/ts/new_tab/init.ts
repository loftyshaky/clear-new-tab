import { InitAll } from 'shared/init_all';
import { d_background, s_background, s_custom_code } from 'new_tab/internal';

export const init = (): Promise<void> =>
    err_async(async () => {
        await InitAll.i().init();

        s_custom_code.Msgs.i().send_set_custom_code_msg();

        s_background.Preview.i().set_id();

        await ext.send_msg_resp({ msg: 'push_tab_id' });
        ext.send_msg({
            msg: 'get_background',
            allow_to_start_slideshow_timer: data.settings.slideshow ? !document.hidden : true,
            force_update: true,
        });

        x.bind(
            document,
            'visibilitychange',
            d_background.BackgroundChange.i().react_to_visibility_change,
        );
        x.bind(
            window,
            'resize',
            d_background.BackgroundChange.i().react_to_visibility_change_debounce,
        );
    }, 'cnt_1078');
