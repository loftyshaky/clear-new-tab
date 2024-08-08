import { Alarms } from 'webextension-polyfill';

import { s_background } from 'shared_clean/internal';
import { s_backgrounds, s_scheduler } from 'background/internal';

we.alarms.onAlarm.addListener(
    (alarm: Alarms.Alarm): Promise<void> =>
        err_async(async () => {
            if (alarm.name === 'change_slideshow_background') {
                await s_background.BackgroundChange.change_slideshow_background();
                await s_background.BackgroundChange.run_slideshow_timer({ rerun: true });
            } else if (alarm.name === 'schedule_background_display') {
                s_scheduler.Scheduler.schedule_background_display({
                    called_after_task_completed: true,
                });
            } else {
                await s_backgrounds.Background.update_background({ background_id: alarm.name });

                we.alarms.create('schedule_background_display', {
                    when: Date.now() + 1000,
                });

                ext.send_msg({ msg: 'set_current_background_i' });
            }
        }, 'cnt_1015'),
);
