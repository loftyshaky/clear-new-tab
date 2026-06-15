import type { i_db } from 'shared_clean/internal';

export interface FileBackground extends i_db.BackgroundProps {
    [index: string]: string | number | undefined;

    id: string;
    theme_id: string | undefined;
    i: string;
    type: i_db.FileBackgroundType;
    width: number;
    height: number;
    thumbnail_width: number;
    thumbnail_height: number;
}
