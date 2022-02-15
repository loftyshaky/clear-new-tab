export interface FileBackground {
    id: string;
    theme_id: string | undefined;
    i: string;
    type: 'img_file' | 'video_file' | 'img_link';
    width: number;
    height: number;
    thumbnail_width: number;
    thumbnail_height: number;
    background_size: string;
    background_position: string;
    background_repeat: string;
    color_of_area_around_background: string;
    video_volume: string;
}
