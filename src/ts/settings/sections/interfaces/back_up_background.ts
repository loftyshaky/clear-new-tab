import { i_db } from 'shared/internal';
import { i_sections } from 'settings/internal';

export interface BackUpBackground {
    data: i_db.Background;
    thumbnail: i_sections.BackUpBackgroundThumbnail;
    file: i_sections.BackUpBackgroundFile;
}
