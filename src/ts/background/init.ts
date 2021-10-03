import { db } from 'shared/internal';
import { s_data } from 'background/internal';

export const init = (): Promise<void> =>
    err_async(async () => {
        s_data.Main.i().init_defaults();
        db.init_db();
        await s_data.Main.i().set_from_storage();
    }, 'cnt_1016');
