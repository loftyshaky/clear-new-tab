import { s_db, i_db } from 'shared/internal';
import {
    d_backgrounds,
    d_pagination,
    d_protecting_screen,
    s_i,
    s_scrollable,
} from 'settings/internal';

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
        update_current_background_id = true,
    }: {
        color: string;
        theme_id?: string;
        update_current_background_id?: boolean;
    }): Promise<void> =>
        err_async(async () => {
            d_protecting_screen.Visibility.i().show();

            const no_backgrounds_before_upload: boolean =
                d_backgrounds.Main.i().backgrounds.length === 0;
            const id: string = x.unique_id();
            const new_backgrounds: i_db.Background[] = [
                {
                    id,
                    theme_id,
                    i: s_i.I.i().get_next_i({
                        items: d_backgrounds.Main.i().backgrounds,
                    }),
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
            });

            if (update_current_background_id) {
                if (no_backgrounds_before_upload) {
                    // eslint-disable-next-line max-len
                    await d_backgrounds.CurrentBackground.i().set_current_background_id_to_id_of_first_background();
                } else {
                    // eslint-disable-next-line max-len
                    await d_backgrounds.CurrentBackground.i().set_last_uploaded_background_as_current(
                        {
                            id,
                        },
                    );
                }
            }

            await d_backgrounds.BackgroundAnimation.i().forbid_animation();

            d_pagination.Page.i().set_last();

            s_scrollable.Main.i().set_scroll_position({
                scrollable_type: 'backgrounds',
            });
            d_protecting_screen.Visibility.i().hide();
        }, 'cnt_1108');
}
