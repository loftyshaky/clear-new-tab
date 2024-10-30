import { i_color } from '@loftyshaky/shared/shared_clean';

export interface Prefs {
    version: string;
    clipboard_read_permission: boolean;
    options_page_theme: string;
    transition_duration: number;
    color_help_is_visible: boolean;
    developer_mode: boolean;
    enable_cut_features: boolean;
    persistent_service_worker: boolean;
    offers_are_visible: boolean;
    admin_section_content_is_visible: boolean;
    colors: i_color.Color[];
    install_help_is_visible: boolean;
    mode: string;
    color_type: string;
    keep_old_theme_backgrounds: boolean;
    current_background_id: string | number;
    future_background_id: string | number;
    automatically_set_last_uploaded_background_as_current: boolean;
    background_change_interval: number;
    slideshow: boolean;
    background_change_effect: string;
    shuffle_backgrounds: boolean;
    slide_direction: string;
    background_size: string;
    background_position: string;
    background_repeat: string;
    color_of_area_around_background: number;
    video_speed: number;
    video_volume: number;
    download_img_when_link_given: boolean;
    home_btn_is_visible: boolean;
    home_btn_position: string;
    paste_btn_is_visible: boolean;
    year: string;
    day_of_the_week: string;
    month: string;
    day_of_the_month: string;
    time: string;
    background_change_time: number;
    install_help_msg_is_visible: boolean;
    id_of_last_installed_theme: string;
    current_random_solid_color: string;
    enable_video_repeat: boolean;
    backgrounds_per_page: number;
    always_use_alarms_api_to_change_background_in_slideshow_mode: boolean;
    show_item_developer_info_in_tooltip: boolean;
    update_database_when_dnd_item: boolean;
    one_backup_file_size_in_bytes: number;
}
