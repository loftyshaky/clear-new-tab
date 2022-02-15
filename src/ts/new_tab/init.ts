import { d_background } from 'new_tab/internal';

export const init = (): Promise<void> =>
    err_async(async () => {
        ext.send_msg({ msg: 'push_tab_id' });
        ext.send_msg({ msg: 'get_background' });

        x.bind(
            document,
            'visibilitychange',
            d_background.BackgroundChange.i().react_to_visibility_change,
        );
    }, 'cnt_61125');
