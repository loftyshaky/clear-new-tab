import { d_background } from 'new_tab/internal';

export const init = (): void =>
    err(() => {
        d_background.BackgroundChange.i().try_to_change_background();
    }, 'cnt_61125');
