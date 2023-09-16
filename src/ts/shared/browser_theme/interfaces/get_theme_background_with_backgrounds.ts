import { i_browser_theme, i_db } from 'shared/internal';

export interface GetThemeBackgroundWithBackgrounds extends i_browser_theme.GetThemeBackground {
    backgrounds: i_db.Background[];
}
