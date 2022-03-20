import { i_db } from 'shared/internal';
import { d_backgrounds } from 'settings/internal';

export class BackgroundPreview {
    private static i0: BackgroundPreview;

    public static i(): BackgroundPreview {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public get = ({ background_id }: { background_id: string }): string =>
        err(() => {
            const background_thumbnail: i_db.BackgroundThumbnail | undefined =
                d_backgrounds.Main.i().get_background_thumbnail_by_id({
                    id: background_id,
                });

            return n(background_thumbnail) && n(background_thumbnail.background)
                ? background_thumbnail.background
                : 'scheduler_background_preview_placeholder.png';
        }, '_99999');
}
