import { makeObservable, action } from 'mobx';

import { i_db } from 'shared/internal';
import { d_background_settings } from 'settings/internal';

export class GlobalCheckboxes {
    private static i0: GlobalCheckboxes;

    public static i(): GlobalCheckboxes {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    private constructor() {
        makeObservable(this, {
            set_ui_vals: action,
        });
    }

    public global_checkboxes: string[] = [
        'color_of_area_around_background_global',
        'video_volume_global',
    ];

    public set_ui_vals = (): void =>
        err(() => {
            const settings_context_is_global: boolean = data.ui.settings_context === 'global';
            let video_volume_is_global = false;
            let color_of_area_around_background_is_global = false;

            if (
                n(d_background_settings.SettingsContext.i().selected_background) &&
                !d_background_settings.SettingsContext.i().selected_background!.type.includes(
                    'color',
                )
            ) {
                color_of_area_around_background_is_global =
                    (
                        d_background_settings.SettingsContext.i()
                            .selected_background! as i_db.FileBackground
                    ).color_of_area_around_background === 'global';

                video_volume_is_global =
                    (
                        d_background_settings.SettingsContext.i()
                            .selected_background! as i_db.FileBackground
                    ).video_volume === 'global';
            }

            data.ui.color_of_area_around_background_global =
                settings_context_is_global || color_of_area_around_background_is_global;

            data.ui.video_volume_global = settings_context_is_global || video_volume_is_global;
        }, 'cnt_64294');

    public restore_global_val = ({ name }: { name: string }): Promise<void> =>
        err_async(async () => {
            await d_background_settings.Val.i().change_background_val({
                name,
                new_val: 'global',
            });
        }, 'cnt_64356');
}
