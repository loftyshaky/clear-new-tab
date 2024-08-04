import { makeObservable, action } from 'mobx';

import { i_data } from '@loftyshaky/shared/shared';
import { s_db } from 'shared_clean/internal';
import { d_background_settings } from 'settings/internal';

export class Val {
    private static i0: Val;

    public static i(): Val {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    private constructor() {
        makeObservable(this, {
            change: action,
            change_background_val: action,
        });
    }

    public allowed_keys: string[] = [
        'background_size',
        'background_position',
        'background_repeat',
        'color_of_area_around_background',
        'video_speed',
        'video_volume',
    ];

    public change = ({ name, new_val }: { name: string; new_val: i_data.Val }): Promise<void> =>
        err_async(async () => {
            if (this.allowed_keys.includes(name)) {
                if (data.ui.settings_context === 'global') {
                    data.settings[name] = new_val;

                    d_background_settings.SettingsContext.i().react_to_global_selection();

                    await ext.send_msg_resp({
                        msg: 'update_settings_background',
                        settings: { [name]: new_val },
                        update_background: true,
                    });
                } else if (data.ui.settings_context === 'selected_background') {
                    await this.change_background_val({ name, new_val });
                }
            }
        }, 'cnt_1088');

    public change_background_val = ({
        name,
        new_val,
    }: {
        name: string;
        new_val: i_data.Val;
    }): Promise<void> =>
        err_async(async () => {
            (d_background_settings.SettingsContext.i().selected_background as any)[name] = new_val;

            d_background_settings.SettingsContext.i().react_to_background_selection({
                background: d_background_settings.SettingsContext.i().selected_background,
            });

            await s_db.Manipulation.i().update_background({
                background: d_background_settings.SettingsContext.i().selected_background!,
            });

            await ext.send_msg_resp({
                msg: 'set_current_background_data',
                current_background_id: data.settings.current_background_id,
                force: true,
            });

            ext.send_msg({
                msg: 'get_background',
                allow_to_start_slideshow_timer: false,
                force_update: true,
            });
        }, 'cnt_1089');
}
