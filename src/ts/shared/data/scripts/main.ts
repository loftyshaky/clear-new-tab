import _ from 'lodash';

import { t, o_schema, d_schema } from '@loftyshaky/shared';
import { d_color } from '@loftyshaky/shared/inputs';
import { vars, d_backgrounds, s_background, i_data } from 'shared/internal';

export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public defaults: i_data.Settings | t.EmptyRecord = {};
    public service_worker_woken_up_by_update_settings_background_msg: boolean = false; // needed to prevent overwriting current_background_id by current value in set_from_storage function when uploading background while background service worker inactive

    public init_defaults = (): void =>
        err(() => {
            this.defaults = {
                options_page_theme: 'lavender',
                transition_duration: 200,
                color_help_is_visible: true,
                enable_cut_features: false,
                colors: d_color.Color.i().default_colors,
                last_version: undefined,
                install_help_is_visible: true,
                mode: 'theme_background',
                color_type: 'pastel',
                keep_old_theme_backgrounds: false,
                current_background_id: d_backgrounds.CurrentBackground.i().reset_val,
                future_background_id: d_backgrounds.CurrentBackground.i().reset_val,
                automatically_set_last_uploaded_background_as_current: true,
                background_change_interval: 1,
                slideshow: false,
                background_change_effect: 'crossfade',
                shuffle_backgrounds: false,
                slide_direction: 'random',
                background_size: 'dont_resize',
                background_position: 'center',
                background_repeat: 'no_repeat',
                color_of_area_around_background: 0,
                video_speed: 1,
                video_volume: 0,
                download_img_when_link_given: false,
                home_btn_is_visible: false,
                home_btn_position: 'right_top',
                year: '',
                day_of_the_week: vars.scheduler_none_val,
                month: '',
                day_of_the_month: '',
                time: '00:00:00',
                background_change_time: 0,
                install_help_msg_is_visible: true,
                id_of_last_installed_theme: '',
                current_random_solid_color: '',
                enable_video_repeat: false,
                always_use_alarms_api_to_change_background_in_slideshow_mode: false,
                show_item_developer_info_in_tooltip: false,
                update_database_when_dnd_item: true,
                options_page_tab_id: undefined,
                one_backup_file_size_in_bytes: 536870888,
            };
        }, 'cnt_1319');

    public update_settings = ({
        settings,
        update_background,
        transform = false,
    }: {
        settings?: i_data.Settings;
        update_background?: boolean;
        transform?: boolean;
    } = {}): Promise<void> =>
        err_async(async () => {
            const settings_2: i_data.Settings = n(settings)
                ? settings
                : (this.defaults as i_data.Settings);

            let settings_final: i_data.Settings = settings_2;

            if (transform) {
                settings_final = await this.transform({ settings: settings_2 });
            }

            await ext.storage_set(settings_final);

            if (n(update_background) && update_background) {
                s_background.BackgroundChange.i().try_to_change_background({
                    allow_to_start_slideshow_timer: false,
                    force_update: true,
                });
            }
        }, 'cnt_1320');

    public update_settings_debounce = _.debounce(
        (settings: i_data.Settings, update_background?: boolean, transform: boolean = false) =>
            err_async(async () => {
                await this.update_settings({ settings, update_background, transform });
            }, 'cnt_1321'),
        500,
    );

    public set_from_storage = ({
        transform = false,
    }: { transform?: boolean } = {}): Promise<void> =>
        err_async(async () => {
            const settings: i_data.Settings = await ext.storage_get();

            if (_.isEmpty(settings)) {
                await this.update_settings({ transform });
            } else if (
                transform &&
                !this.service_worker_woken_up_by_update_settings_background_msg
            ) {
                await this.update_settings({ settings, transform });
            }
        }, 'cnt_1322');

    private transform = ({ settings }: { settings: i_data.Settings }): Promise<i_data.Settings> =>
        err_async(async () => {
            const transform_items: o_schema.TransformItem[] = [
                new o_schema.TransformItem({
                    new_key: 'video_speed',
                    new_val: 1,
                }),
                new o_schema.TransformItem({
                    new_key: 'enable_video_repeat',
                    new_val: false,
                }),
                new o_schema.TransformItem({
                    new_key: 'always_use_alarms_api_to_change_background_in_slideshow_mode',
                    new_val: false,
                }),
                new o_schema.TransformItem({
                    new_key: 'one_backup_file_size_in_bytes',
                    new_val: 536870888,
                }),
            ];

            const settings_final: i_data.Settings = await d_schema.Main.i().transform({
                data: settings,
                transform_items,
                remove_from_storage: false,
            });

            return settings_final;
        }, 'cnt_1199');
}
