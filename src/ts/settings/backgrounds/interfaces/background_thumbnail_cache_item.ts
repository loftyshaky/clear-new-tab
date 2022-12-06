export interface BackgroundThumbnailCacheItem {
    [index: string]: any;
    thumbnail?: string;
    placeholder_color?: string;
    loaded_once?: boolean;
    faded_in_once?: boolean;
}
