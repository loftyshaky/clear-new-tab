import { Alarms } from 'webextension-polyfill-ts';
import { s_backgrounds, s_scheduler } from 'background/internal';

we.alarms.onAlarm.addListener(
    (alarm: Alarms.Alarm): Promise<void> =>
        err_async(async () => {
            await s_backgrounds.Main.i().update_background({ background_id: alarm.name });

            s_scheduler.Main.i().schedule_background_display();
        }, 'cnt_64676'),
);
