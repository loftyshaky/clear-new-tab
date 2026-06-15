import { d_background, s_background, s_custom_code } from 'new_tab/internal';
import { InitAll } from 'shared/internal';

export const init = (): Promise<void> =>
    err_async(async () => {
        void InitAll.init();

        void s_custom_code.Msgs.send_set_custom_code_msg();
        d_background.Background.init_vars();
        d_background.BackgroundSize.init_vars();
        d_background.Classes.init_vars();
        s_background.Preview.set_id();
        void ext.send_msg({
            msg: 'react_to_init_new_tab',
            allow_to_start_slideshow_timer: data.settings.prefs.slideshow ? !document.hidden : true,
            force_update: false,
        });

        x.bind(
            document,
            'visibilitychange',
            d_background.BackgroundChange.react_to_visibility_change,
        );
        x.bind(window, 'resize', d_background.BackgroundChange.react_to_visibility_change);
    }, 'cnt_1078');
