import { InitAll } from 'shared/init_all';

export const init = (): void =>
    err(() => {
        InitAll.i().init();

        InitAll.i().render_announcement();
    }, 'cnt_61125');
