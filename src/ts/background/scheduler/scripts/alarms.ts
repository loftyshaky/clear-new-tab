import { Alarms } from 'webextension-polyfill-ts';
import { s_background, s_data, i_data } from 'shared/internal';
import { s_scheduler } from 'background/internal';

we.alarms.onAlarm.addListener(
    (alarm: Alarms.Alarm): Promise<void> =>
        err_async(async () => {
            const settings: i_data.Settings = await ext.storage_get();

            settings.current_background_id = alarm.name;

            await s_data.Main.i().update_settings({
                settings,
            });

            s_background.BackgroundChange.i().update_background({ no_tr: false });

            s_scheduler.Main.i().schedule_background_display();
        }, 'cnt_64676'),
);
