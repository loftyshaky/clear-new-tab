import { s_db, i_db } from 'shared/internal';
import { d_backgrounds, s_backgrounds } from 'settings/internal';

export class Color {
    private static i0: Color;

    public static i(): Color {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public create_solid_color_background = ({ color }: { color: string }): Promise<void> =>
        err_async(async () => {
            const new_backgrounds: i_db.Background[] = [
                {
                    theme_id: undefined,
                    i: s_backgrounds.I.i().get_highest_background_i({
                        creating_solid_color_background: true,
                    }),
                    type: 'color',
                    thumbnail: color,
                },
            ];

            const new_background_files: i_db.BackgroundFile[] = [
                {
                    background: color,
                },
            ];

            d_backgrounds.Main.i().merge_backgrounds({ backgrounds: new_backgrounds });

            await s_db.Manipulation.i().save_backgrounds({
                backgrounds: new_backgrounds,
                background_files: new_background_files,
            });
        }, 'cnt_45931');
}
