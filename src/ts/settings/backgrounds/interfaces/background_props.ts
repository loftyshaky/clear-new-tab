import { i_backgrounds } from 'settings/internal';

export interface BackgroundProps extends i_backgrounds.BackgroundDims, i_backgrounds.ThumbnailDims {
    thumbnail: string;
}
