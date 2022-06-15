import { InitAll } from 'shared/init_all';
import { d_background, s_custom_code } from 'new_tab/internal';

export const init = (): Promise<void> =>
    err_async(async () => {
        InitAll.i().init();

        s_custom_code.Msgs.i().send_set_custom_code_msg();

        d_background.BackgroundChange.i().record_new_tab_page_visit();

        ext.send_msg({ msg: 'push_tab_id' });
        ext.send_msg({ msg: 'get_background', allow_to_start_slideshow_timer: !document.hidden });

        x.bind(
            document,
            'visibilitychange',
            d_background.BackgroundChange.i().react_to_visibility_change,
        );
        x.bind(window, 'resize', d_background.BackgroundChange.i().update_background_css);

        InitAll.i().render_new_tab();
    }, 'cnt_1078');