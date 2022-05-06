import { db, s_data } from 'shared/internal';
import { s_announcement, s_db, s_scheduler } from 'background/internal';

export const init = (): Promise<void> =>
    err_async(async () => {
        s_data.Main.i().init_defaults();
        await s_data.Main.i().set_from_storage();
        await s_announcement.Main.i().display_announcement();
        await s_scheduler.Main.i().schedule_background_display();
        db.init_db();
        await s_db.Main.i().delete_old_db();
    }, 'cnt_1010');
