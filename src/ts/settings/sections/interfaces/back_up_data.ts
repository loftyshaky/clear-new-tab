import { i_data } from 'shared/internal';
import { i_sections } from 'settings/internal';

export interface BackUpData {
    settings: i_data.Settings;
    backgrounds: i_sections.BackUpBackground[];
}
