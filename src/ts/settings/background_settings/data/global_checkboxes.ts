import { makeObservable, action } from 'mobx';

import { i_db } from 'shared/internal';
import { d_background_settings } from 'settings/internal';

export class GlobalCheckboxes {
    private static i0: GlobalCheckboxes;

    public static i(): GlobalCheckboxes {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {
        makeObservable(this, {
            set_ui_values: action,
        });
    }

    public set_ui_values = (): void =>
        err(() => {
            const settings_type_is_global: boolean = data.ui.settings_type === 'global';
            let video_volume_is_global = false;
            let color_of_area_around_background_is_global = false;

            if (
                n(d_background_settings.SettingsType.i().selected_background) &&
                !d_background_settings.SettingsType.i().selected_background!.type.includes('color')
            ) {
                color_of_area_around_background_is_global =
                    (
                        d_background_settings.SettingsType.i()
                            .selected_background! as i_db.FileBackground
                    ).color_of_area_around_background === 'global';

                video_volume_is_global =
                    (
                        d_background_settings.SettingsType.i()
                            .selected_background! as i_db.FileBackground
                    ).video_volume === 'global';
            }

            data.ui.color_of_area_around_background_global =
                settings_type_is_global || color_of_area_around_background_is_global;

            data.ui.video_volume_global = settings_type_is_global || video_volume_is_global;
        }, 'cnt_64294');
}
