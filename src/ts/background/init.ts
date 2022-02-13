import { db, s_data } from 'shared/internal';

export const init = (): Promise<void> =>
    err_async(async () => {
        s_data.Main.i().init_defaults();
        db.init_db();
    }, 'cnt_1016');
