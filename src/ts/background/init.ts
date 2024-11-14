import { s_data as s_data_loftyshaky_shared_clean } from '@loftyshaky/shared/shared_clean';
import { db, d_data, s_data } from 'shared_clean/internal';
import { s_announcement, s_badge, s_db, s_offscreen, s_scheduler } from 'background/internal';

export const init = (): Promise<void> =>
    err_async(async () => {
        d_data.Ui.create_ui_objs();
        await s_offscreen.Document.create();
        s_data.Settings.init_defaults();
        await s_data_loftyshaky_shared_clean.Cache.set_data();
        await s_data.Manipulation.on_init_set_from_storage();
        s_badge.Badge.set_badge_color();
        await s_announcement.Visibility.display_announcement();
        await s_scheduler.Scheduler.schedule_background_display();
        db.init();
        await s_db.Db.delete_old_db();
    }, 'cnt_1010');
