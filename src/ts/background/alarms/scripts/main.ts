import { Alarms } from 'webextension-polyfill-ts';

import { s_background, i_data } from 'shared/internal';
import { s_backgrounds, s_scheduler } from 'background/internal';

we.alarms.onAlarm.addListener(
    (alarm: Alarms.Alarm): Promise<void> =>
        err_async(async () => {
            const settings: i_data.Settings = await ext.storage_get();
            const can_do_slideshow: boolean =
                await s_background.BackgroundChange.i().can_do_slideshow();

            if (settings.mode === 'scheduled') {
                if (alarm.name === 'schedule_background_display') {
                    s_scheduler.Main.i().schedule_background_display({
                        called_after_task_completed: true,
                    });
                } else {
                    await s_backgrounds.Main.i().update_background({ background_id: alarm.name });

                    we.alarms.create('schedule_background_display', {
                        when: Date.now() + 1000,
                    });
                }
            } else if (can_do_slideshow) {
                await s_background.BackgroundChange.i().clear_slideshow_timer();

                if (alarm.name === 'schedule_background_change') {
                    await s_background.BackgroundChange.i().change_background({
                        current_time: new Date().getTime(),
                        no_tr: false,
                    });

                    await s_background.BackgroundChange.i().schedule_background_change({
                        rerun: s_background.BackgroundChange.i().rerun,
                    });
                }
            }
        }, 'cnt_64676'),
);
