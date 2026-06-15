import type { t } from '@loftyshaky/shared/shared_clean';
import type { i_db } from 'shared_clean/internal';

export interface ThemeBackgroundInfo {
    theme_package_data: t.AnyRecord;
    clear_new_tab_video_file_name: string | undefined;
    img_file_name: string | undefined;
    background_props: i_db.BackgroundProps;
}
