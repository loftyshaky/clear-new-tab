import { db, d_data, s_data } from 'shared_clean/internal';
import { s_announcement, s_badge, s_db, s_offscreen, s_scheduler } from 'background/internal';

export const init = (): Promise<void> =>
    err_async(async () => {
        d_data.Data.create_objs();
        await s_offscreen.Document.create();
        s_data.Data.init_defaults();
        await s_data.Data.set_from_storage({ transform: true });
        s_badge.Badge.set_badge_color();
        await s_announcement.Visibility.display_announcement();
        await s_scheduler.Scheduler.schedule_background_display();
        db.init();
        await s_db.Db.delete_old_db();

        const settings = await ext.storage_get(undefined, true);

        await ext.send_msg_resp({
            msg: 'set_current_background_data',
            current_background_id: settings.current_background_id,
            force: true,
        });
    }, 'cnt_1010');
