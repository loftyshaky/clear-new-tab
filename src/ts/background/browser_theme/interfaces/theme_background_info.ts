import { i_db } from 'shared_clean/internal';

export interface ThemeBackgroundInfo {
    theme_package_data: any;
    clear_new_tab_video_file_name: string | undefined;
    img_file_name: string | undefined;
    background_props: i_db.BackgroundProps;
}
