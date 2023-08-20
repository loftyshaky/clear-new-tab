import { db, s_data } from 'shared/internal';
import { s_announcement, s_db, s_offscreen, s_scheduler } from 'background/internal';

export const init = (): Promise<void> =>
    err_async(async () => {
        s_data.Main.i().init_defaults();
        await s_data.Main.i().set_from_storage({ transform: true });
        await s_announcement.Main.i().display_announcement();
        await s_scheduler.Main.i().schedule_background_display();
        db.init_db();
        await s_db.Main.i().delete_old_db();
        await s_offscreen.Main.i().create_document();
    }, 'cnt_1010');
