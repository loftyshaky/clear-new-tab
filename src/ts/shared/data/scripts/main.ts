import _ from 'lodash';

import { t } from '@loftyshaky/shared';
import { d_color } from '@loftyshaky/shared/inputs';
import { s_background, i_data } from 'shared/internal';

export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public defaults: i_data.Settings | t.EmptyRecord = {};

    public init_defaults = (): void =>
        err(() => {
            this.defaults = {
                options_page_theme: 'dark',
                transition_duration: 200,
                color_help_is_visible: true,
                enable_cut_features: false,
                colors: d_color.Color.i().default_colors,
                mode: 'theme_background',
                keep_old_themes_backgrounds: false,
                current_background_id: 1,
                future_background_id: 1,
                automatically_set_last_uploaded_background_as_current: true,
                background_change_interval: 1,
                slideshow: false,
                background_change_effect: 'crossfade',
                shuffle_backgrounds: false,
                slide_direction: 'from_right_to_left',
                background_size: 'dont_resize',
                background_position: 'center',
                background_repeat: 'no_repeat',
                color_of_area_around_background: 0,
                video_volume: 0,
                download_img_when_link_given: false,
                background_change_time: 0,
                install_help_msg_is_visible: true,
                current_random_solid_color: '',
                show_background_id_and_i_in_tooltip: false,
                update_database_when_dnd_background: true,
            };
        }, 'cnt_1002');

    public update_settings = ({
        settings,
        update_background,
    }: {
        settings?: i_data.Settings;
        update_background?: boolean;
        update_settings_obj?: boolean;
    } = {}): Promise<void> =>
        err_async(async () => {
            const settings_final: i_data.Settings = n(settings)
                ? settings
                : (this.defaults as i_data.Settings);

            await ext.storage_set(settings_final);

            if (n(update_background) && update_background) {
                s_background.BackgroundChange.i().try_to_change_background({
                    allow_to_start_slideshow_timer: false,
                });
            }
        }, 'cnt_1003');

    public update_settings_debounce = _.debounce(
        (settings: i_data.Settings, update_background?: boolean) =>
            err_async(async () => {
                await this.update_settings({ settings, update_background });
            }, 'cnt_1177'),
        500,
    );

    public set_from_storage = (): Promise<void> =>
        err_async(async () => {
            const settings: i_data.Settings = await ext.storage_get();

            if (_.isEmpty(settings)) {
                this.update_settings();
            }
        }, 'cnt_1004');
}
