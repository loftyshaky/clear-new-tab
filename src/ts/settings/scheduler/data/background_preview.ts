import { i_db } from 'shared_clean/internal';
import { d_backgrounds } from 'settings/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public placeholder_img: string = 'scheduler_background_preview_placeholder.png';

    public get = ({ background_id }: { background_id: string }): Promise<string> =>
        err_async(
            async () =>
                d_backgrounds.Backgrounds.get_background_thumbnail_by_id({
                    id: background_id,
                    placeholder_img: this.placeholder_img,
                }),
            'cnt_1229',
        );

    public background_is_color = ({ background_id }: { background_id: string }): boolean =>
        err(() => {
            const background: i_db.Background | undefined =
                d_backgrounds.Backgrounds.get_background_by_id({
                    id: background_id,
                });

            if (n(background)) {
                return background.type === 'color';
            }

            return false;
        }, 'cnt_1428');
}

export const BackgroundPreview = Class.get_instance();
