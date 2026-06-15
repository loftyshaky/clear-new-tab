export interface BackgroundThumbnailCacheItem {
    [index: string]: string | boolean | undefined;
    thumbnail?: string;
    placeholder_color?: string;
    loaded_once?: boolean;
    faded_in_once?: boolean;
}
