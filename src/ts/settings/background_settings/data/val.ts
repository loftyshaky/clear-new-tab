import { makeObservable, action } from 'mobx';

import { i_data } from '@loftyshaky/shared/shared';
import { d_data, s_db } from 'shared_clean/internal';
import { d_background_settings } from 'settings/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
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
                    data.settings.prefs[name] = new_val;

                    d_background_settings.SettingsContext.react_to_global_selection();

                    await d_data.Manipulation.send_msg_to_update_settings({
                        settings: {
                            prefs: {
                                ...data.settings.prefs,
                                [name]: new_val,
                            },
                        },
                        load_settings: true,
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
            (d_background_settings.SettingsContext.selected_background as any)[name] = new_val;

            d_background_settings.SettingsContext.react_to_background_selection({
                background: d_background_settings.SettingsContext.selected_background,
            });

            await s_db.Manipulation.update_background({
                background: d_background_settings.SettingsContext.selected_background!,
            });

            await ext.send_msg_resp({
                msg: 'set_current_background_data',
                current_background_id: data.settings.prefs.current_background_id,
                force: true,
            });

            ext.send_msg({
                msg: 'get_background',
                allow_to_start_slideshow_timer: false,
                force_update: true,
            });
        }, 'cnt_1089');
}
export const Val = Class.get_instance();
