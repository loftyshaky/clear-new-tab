import { i_color } from '@loftyshaky/shared/inputs';
import { i_data } from 'shared/internal';

export interface Settings extends i_data.Date {
    [index: string]: any;
    options_page_theme: string;
    transition_duration: number;
    color_help_is_visible: boolean;
    enable_cut_features: boolean;
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
    video_volume: number;
    download_img_when_link_given: boolean;
    background_change_time: number;
    install_help_msg_is_visible: boolean;
    id_of_last_installed_theme: string;
    current_random_solid_color: string;
    show_item_developer_info_in_tooltip: boolean;
    update_database_when_dnd_item: boolean;
    options_page_tab_id: number | undefined;
}
