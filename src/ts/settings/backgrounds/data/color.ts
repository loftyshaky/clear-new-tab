import { s_db, i_db } from 'shared/internal';
import { d_backgrounds, d_protecting_screen, s_backgrounds } from 'settings/internal';

export class Color {
    private static i0: Color;

    public static i(): Color {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public create_solid_color_background = ({
        color,
        theme_id,
    }: {
        color: string;
        theme_id?: string;
    }): Promise<void> =>
        err_async(async () => {
            d_protecting_screen.Visibility.i().show();
            const id: string = x.unique_id();
            const new_backgrounds: i_db.Background[] = [
                {
                    id,
                    theme_id,
                    i: s_backgrounds.I.i().get_next_background_i(),
                    type: 'color',
                },
            ];

            const new_background_thumbnails: i_db.BackgroundThumbnail[] = [
                {
                    id,
                    background: color,
                },
            ];

            const new_background_files: i_db.BackgroundFile[] = [
                {
                    id,
                    background: color,
                },
            ];

            await s_db.Manipulation.i().save_backgrounds({
                backgrounds: new_backgrounds,
                background_thumbnails: new_background_thumbnails,
                background_files: new_background_files,
            });

            d_backgrounds.BackgroundAnimation.i().allow_animation();
            d_backgrounds.Main.i().merge_backgrounds({
                backgrounds: new_backgrounds,
                background_thumbnails: new_background_thumbnails,
            });
            d_backgrounds.CurrentBackground.i().set_last_uploaded_background_as_current({
                id,
            });
            await d_backgrounds.BackgroundAnimation.i().forbid_animation();

            d_protecting_screen.Visibility.i().hide();
        }, 'cnt_45931');
}
