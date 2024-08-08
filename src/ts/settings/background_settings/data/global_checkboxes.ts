import { makeObservable, action } from 'mobx';

import { i_db } from 'shared_clean/internal';
import { d_background_settings } from 'settings/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {
        makeObservable(this, {
            set_ui_vals: action,
        });
    }

    public global_checkboxes: string[] = [
        'color_of_area_around_background_global',
        'video_speed_global',
        'video_volume_global',
    ];

    public set_ui_vals = (): void =>
        err(() => {
            const settings_context_is_global: boolean = data.ui.settings_context === 'global';
            let video_speed_is_global = false;
            let video_volume_is_global = false;
            let color_of_area_around_background_is_global = false;

            if (
                n(d_background_settings.SettingsContext.selected_background) &&
                !d_background_settings.SettingsContext.selected_background!.type.includes('color')
            ) {
                color_of_area_around_background_is_global =
                    (
                        d_background_settings.SettingsContext
                            .selected_background! as i_db.FileBackground
                    ).color_of_area_around_background === 'global';

                video_speed_is_global =
                    (
                        d_background_settings.SettingsContext
                            .selected_background! as i_db.FileBackground
                    ).video_speed === 'global';

                video_volume_is_global =
                    (
                        d_background_settings.SettingsContext
                            .selected_background! as i_db.FileBackground
                    ).video_volume === 'global';
            }

            data.ui.color_of_area_around_background_global =
                settings_context_is_global || color_of_area_around_background_is_global;

            data.ui.video_speed_global = settings_context_is_global || video_speed_is_global;
            data.ui.video_volume_global = settings_context_is_global || video_volume_is_global;
        }, 'cnt_1082');

    public restore_global_val = ({ name }: { name: string }): Promise<void> =>
        err_async(async () => {
            await d_background_settings.Val.change_background_val({
                name,
                new_val: 'global',
            });
        }, 'cnt_1083');
}

export const GlobalCheckboxes = Class.get_instance();
