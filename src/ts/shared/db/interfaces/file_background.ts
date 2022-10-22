import { i_db } from 'shared/internal';

export interface FileBackground extends i_db.BackgroundProps {
    [index: string]: string | number | i_db.FileBackgroundType | undefined;

    id: string;
    theme_id: string | undefined;
    i: string;
    type: i_db.FileBackgroundType;
    width: number;
    height: number;
    thumbnail_width: number;
    thumbnail_height: number;
}
