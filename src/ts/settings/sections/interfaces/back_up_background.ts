import { i_db } from 'shared/internal';
import { i_sections } from 'settings/internal';

export interface BackUpBackground {
    data: i_db.Background;
    file: i_sections.BackUpBackgroundFile;
}
