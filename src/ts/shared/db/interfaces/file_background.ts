export interface FileBackground {
    id: string;
    theme_id: string | undefined;
    i: number;
    type: 'img_file' | 'video_file' | 'img_link';
    thumbnail: string | undefined;
    width: number;
    height: number;
    thumbnail_width: number;
    thumbnail_height: number;
    background_size: string;
    background_positon: string;
    background_repeat: string;
    color_of_area_around_background: string;
    video_volume: string;
}
