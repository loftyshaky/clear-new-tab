import { i_db } from 'shared/internal';

export interface FileBackground extends i_db.BackgroundProps {
    id: string;
    theme_id: string | undefined;
    i: string;
    type: 'img_file' | 'video_file' | 'img_link';
    width: number;
    height: number;
    thumbnail_width: number;
    thumbnail_height: number;
}
