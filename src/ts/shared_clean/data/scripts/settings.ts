import { t, s_data, s_color } from '@loftyshaky/shared/shared_clean';
import { vars, d_backgrounds, i_data } from 'shared_clean/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public defaults: i_data.Settings | t.EmptyRecord = {};

    public init_defaults = (): void =>
        err(() => {
            this.defaults = {
                prefs: {
                    version: ext.get_app_version(),
                    clipboard_read_permission: false,
                    options_page_theme: 'lavender',
                    transition_duration: 200,
                    color_help_is_visible: true,
                    developer_mode: false,
                    enable_cut_features: false,
                    persistent_service_worker: true,
                    offers_are_visible: true,
                    admin_section_content_is_visible: false,
                    colors: s_color.Colors.default_colors,
                    install_help_is_visible: true,
                    mode: 'theme_background',
                    color_type: 'pastel',
                    keep_old_theme_backgrounds: false,
                    current_background_id: d_backgrounds.CurrentBackground.reset_val,
                    future_background_id: d_backgrounds.CurrentBackground.reset_val,
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
                    paste_btn_is_visible: false,
                    year: '',
                    day_of_the_week: vars.scheduler_none_val,
                    month: '',
                    day_of_the_month: '',
                    time: '00:00:00',
                    background_change_time: 0,
                    install_help_msg_is_visible: true,
                    id_of_last_installed_theme: '',
                    current_random_solid_color: '',
                    backgrounds_per_page: 200,
                    enable_video_repeat: false,
                    always_use_alarms_api_to_change_background_in_slideshow_mode: false,
                    show_item_developer_info_in_tooltip: false,
                    update_database_when_dnd_item: true,
                    one_backup_file_size_in_bytes: 419430400,
                },
            };
        }, 'cnt_1319');

    public apply_unchanged_prefs = ({ settings }: { settings: any }): t.AnyRecord =>
        err(
            () =>
                s_data.Settings.apply_unchanged_prefs({
                    settings,
                    additional_unchanged_prefs: {
                        install_help_is_visible: data.settings.prefs.install_help_is_visible,
                    },
                }),
            'cnt_1530',
        );
}

export const Settings = Class.get_instance();
