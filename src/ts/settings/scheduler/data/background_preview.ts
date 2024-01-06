import { i_db } from 'shared/internal';
import { d_backgrounds } from 'settings/internal';

export class BackgroundPreview {
    private static i0: BackgroundPreview;

    public static i(): BackgroundPreview {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public placeholder_img: string = 'scheduler_background_preview_placeholder.png';

    public get = ({ background_id }: { background_id: string }): Promise<string> =>
        err_async(
            async () =>
                d_backgrounds.Main.i().get_background_thumbnail_by_id({
                    id: background_id,
                    placeholder_img: this.placeholder_img,
                }),
            'cnt_1229',
        );

    public background_is_color = ({ background_id }: { background_id: string }): boolean =>
        err(() => {
            const background: i_db.Background | undefined =
                d_backgrounds.Main.i().get_background_by_id({
                    id: background_id,
                });

            if (n(background)) {
                return background.type === 'color';
            }

            return false;
        }, 'cnt_1428');
}
