export interface Backgrounds {
    background: File | undefined;
    id: string;
    theme_id: string | undefined;
    i: number;
    type: 'img' | 'video' | 'link';
    thumbnail: string | undefined;
    width: number;
    height: number;
    background_size: string;
    background_positon: string;
    background_repeat: string;
    color_of_area_around_background: string;
    video_volume: string;
}
