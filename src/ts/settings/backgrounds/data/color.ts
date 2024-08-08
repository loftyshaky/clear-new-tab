import { d_backgrounds as d_backgrounds_shared_clean } from 'shared_clean/internal';
import { d_progress } from 'shared/internal';
import { d_backgrounds, d_protecting_screen } from 'settings/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
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
            await d_backgrounds_shared_clean.Color.create_solid_color_background({
                color,
                theme_id,
                backgrounds: d_backgrounds.Backgrounds.backgrounds,
                update_current_background_id,
                merge_backgrounds: d_backgrounds.Backgrounds.merge_backgrounds,
                set_current_background_id_to_id_of_first_background:
                    d_backgrounds.CurrentBackground
                        .set_current_background_id_to_id_of_first_background,
                set_last_uploaded_background_as_current:
                    d_backgrounds.CurrentBackground.set_last_uploaded_background_as_current,
                set_progress_max: d_progress.ProgressVal.set_progress_max,
                increment_progress: d_progress.ProgressVal.increment_progress,
                show_protecting_screen: d_protecting_screen.Visibility.show,
                hide_protecting_screen: d_protecting_screen.Visibility.hide,
                allow_animation: d_backgrounds.BackgroundAnimation.allow_animation,
                forbid_animation: d_backgrounds.BackgroundAnimation.forbid_animation,
                upload_success: d_backgrounds.SideEffects.upload_success,
                upload_error: d_backgrounds.SideEffects.upload_error,
            });
        }, 'cnt_1108');
}

export const Color = Class.get_instance();
