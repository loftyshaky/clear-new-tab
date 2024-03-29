import { InitAll } from 'shared/init_all';

export const init = (): Promise<void> =>
    err_async(async () => {
        await InitAll.i().init();

        InitAll.i().render_announcement();
    }, 'cnt_1000');
