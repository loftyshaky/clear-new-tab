import { s_backgrounds } from 'offscreen/internal';

export const init = (): Promise<void> =>
    err_async(async () => {
        s_backgrounds.CurrentBackground.i();
    }, 'cnt_1078');
