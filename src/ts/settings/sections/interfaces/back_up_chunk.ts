import type { i_sections } from 'settings/internal';
import type { i_db } from 'shared_clean/internal';

export interface BackUpChunk {
    data: i_db.Background;
    thumbnail: i_sections.BackUpBackgroundThumbnail;
    file: i_sections.BackUpBackgroundFile;
    tasks: i_db.Task[];
}
