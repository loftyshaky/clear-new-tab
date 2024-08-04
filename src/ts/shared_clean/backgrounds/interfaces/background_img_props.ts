import { i_backgrounds } from 'shared_clean/internal';

export interface BackgroundImgProps
    extends i_backgrounds.BackgroundDims,
        i_backgrounds.ThumbnailDims {
    thumbnail: string;
}
