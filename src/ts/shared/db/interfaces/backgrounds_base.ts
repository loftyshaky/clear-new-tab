export interface BackgroundsBase {
    background: File;
    id: number;
    theme_id: string;
    i: number;
    type: 'img_file' | 'img_link' | 'color';
    thumbnail: string;
    height: number;
    background_size: string;
    background_positon: number;
    background_repeat: string;
    color_of_area_around_background: string;
    video_volume: number;
}
