import { i_browser_theme, i_db } from 'shared_clean/internal';

export interface GetThemeBackgroundWithBackgrounds extends i_browser_theme.GetThemeBackground {
    backgrounds: i_db.Background[];
}
