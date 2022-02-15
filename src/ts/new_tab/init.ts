import { InitAll } from 'shared/init_all';
import { d_background } from 'new_tab/internal';

export const init = (): Promise<void> =>
    err_async(async () => {
        InitAll.i().init();
        ext.send_msg({ msg: 'push_tab_id' });
        ext.send_msg({ msg: 'get_background', allow_to_start_slideshow_timer: !document.hidden });

        x.bind(
            document,
            'visibilitychange',
            d_background.BackgroundChange.i().react_to_visibility_change,
        );
        InitAll.i().render_new_tab();
    }, 'cnt_61125');
