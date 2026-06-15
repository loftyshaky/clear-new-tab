import type { i_sections } from 'settings/internal';
import type { i_data } from 'shared_clean/internal';

export interface BackUpData {
    settings: i_data.Settings;
    backgrounds: i_sections.BackUpChunk[];
}
