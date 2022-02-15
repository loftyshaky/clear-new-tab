import { db, s_data } from 'shared/internal';

export const init = (): Promise<void> =>
    err_async(async () => {
        s_data.Main.i().init_defaults();
        await s_data.Main.i().set_from_storage();
        db.init_db();
    }, 'cnt_1016');
