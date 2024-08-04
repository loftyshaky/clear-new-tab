import { db, d_data, s_data } from 'shared_clean/internal';
import { s_announcement, s_badge, s_db, s_offscreen, s_scheduler } from 'background/internal';

export const init = (): Promise<void> =>
    err_async(async () => {
        d_data.Main.i().create_objs();
        await s_offscreen.Main.i().create_document();
        s_data.Main.i().init_defaults();
        await s_data.Main.i().set_from_storage({ transform: true });
        s_badge.Main.i().set_badge_color();
        await s_announcement.Main.i().display_announcement();
        await s_scheduler.Main.i().schedule_background_display();
        db.init_db();
        await s_db.Main.i().delete_old_db();

        const settings = await ext.storage_get(undefined, true);

        await ext.send_msg_resp({
            msg: 'set_current_background_data',
            current_background_id: settings.current_background_id,
            force: true,
        });
    }, 'cnt_1010');
