import { i_backgrounds } from 'settings/internal';

export interface BackgroundImgProps
    extends i_backgrounds.BackgroundDims,
        i_backgrounds.ThumbnailDims {
    thumbnail: string;
}
