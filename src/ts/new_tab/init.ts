import { InitAll } from 'shared/internal';
import { d_background, s_background, s_custom_code } from 'new_tab/internal';

export const init = (): Promise<void> =>
    err_async(async () => {
        await InitAll.init();

        s_custom_code.Msgs.send_set_custom_code_msg();
        d_background.Background.init_vars();
        d_background.BackgroundSize.init_vars();
        d_background.Classes.init_vars();
        s_background.Preview.set_id();

        await ext.send_msg_resp({ msg: 'push_tab_id' });
        ext.send_msg({
            msg: 'get_background',
            allow_to_start_slideshow_timer: data.settings.slideshow ? !document.hidden : true,
            force_update: true,
        });

        x.bind(
            document,
            'visibilitychange',
            d_background.BackgroundChange.react_to_visibility_change,
        );
        x.bind(window, 'resize', d_background.BackgroundChange.react_to_visibility_change);
    }, 'cnt_1078');
