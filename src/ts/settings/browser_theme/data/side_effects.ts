import { i_db } from 'shared_clean/internal';
import { d_backgrounds as d_backgrounds_shared } from 'shared/internal';
import { d_backgrounds, d_protecting_screen, d_sections } from 'settings/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public change_into_uploading_state = (): Promise<void> =>
        err_async(async () => {
            const uploading_theme_background_now: boolean = await ext.send_msg_resp({
                msg: 'uploading_theme_background_now',
            });

            if (uploading_theme_background_now) {
                this.theme_background_upload_begin();
            }
        }, 'cnt_1508');

    public theme_background_upload_begin = (): void =>
        err(() => {
            d_protecting_screen.Visibility.show();
            d_sections.Upload.set_visibility_of_loading_msg({ is_visible: true });
        }, 'cnt_1506');

    public theme_background_upload_success = ({
        backgrounds,
        current_background_id,
    }: {
        backgrounds: i_db.Background[];
        current_background_id: number | string;
    }): void =>
        err(() => {
            const new_backgrounds: i_db.Background[] = d_backgrounds.Backgrounds.merge_backgrounds({
                backgrounds,
            });
            d_backgrounds.SideEffects.upload_success();
            d_backgrounds_shared.CurrentBackground.set_current_background_i({
                backgrounds: new_backgrounds,
                current_background_id,
            });
            d_sections.Upload.set_visibility_of_loading_msg({ is_visible: false });
            d_protecting_screen.Visibility.hide();
        }, 'cnt_1504');

    public show_unable_to_load_background_of_local_theme_notification = (): void =>
        err(() => {
            show_notification({
                error_msg_key: 'unable_to_load_background_of_local_theme_notification',
                hide_delay: 30000,
            });
        }, 'cnt_1507');
}

export const SideEffects = Class.get_instance();
