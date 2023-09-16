import { d_backgrounds as d_backgrounds_shared, d_progress } from 'shared/internal';
import { d_backgrounds, d_protecting_screen } from 'settings/internal';

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
            await d_backgrounds_shared.Color.i().create_solid_color_background({
                color,
                theme_id,
                backgrounds: d_backgrounds.Main.i().backgrounds,
                update_current_background_id,
                merge_backgrounds: d_backgrounds.Main.i().merge_backgrounds,
                set_current_background_id_to_id_of_first_background:
                    d_backgrounds.CurrentBackground.i()
                        .set_current_background_id_to_id_of_first_background,
                set_last_uploaded_background_as_current:
                    d_backgrounds.CurrentBackground.i().set_last_uploaded_background_as_current,
                set_progress_max: d_progress.ProgressVal.i().set_progress_max,
                increment_progress: d_progress.ProgressVal.i().increment_progress,
                show_protecting_screen: d_protecting_screen.Visibility.i().show,
                hide_protecting_screen: d_protecting_screen.Visibility.i().hide,
                allow_animation: d_backgrounds.BackgroundAnimation.i().allow_animation,
                forbid_animation: d_backgrounds.BackgroundAnimation.i().forbid_animation,
                upload_success: d_backgrounds.SideEffects.i().upload_success,
                upload_error: d_backgrounds.SideEffects.i().upload_error,
            });
        }, 'cnt_1108');
}
