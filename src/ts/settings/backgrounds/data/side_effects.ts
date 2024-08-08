import { d_pagination, d_protecting_screen, d_sections, s_scrollable } from 'settings/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public upload_success = (): Promise<void> =>
        err_async(async () => {
            await d_pagination.Page.set_last();

            s_scrollable.Scrollable.set_scroll_position({
                scrollable_type: 'backgrounds',
            });
            d_protecting_screen.Visibility.hide();
        }, 'cnt_1479');

    public upload_error = ({
        show_error_in_upload_box = true,
    }: {
        show_error_in_upload_box?: boolean;
    }): Promise<void> =>
        err_async(async () => {
            if (show_error_in_upload_box) {
                d_sections.Upload.set_visibility_of_error_msg({ is_visible: true });
            }

            s_scrollable.Scrollable.set_scroll_position({
                scrollable_type: 'backgrounds',
            });
            d_protecting_screen.Visibility.hide();
        }, 'cnt_1480');
}

export const SideEffects = Class.get_instance();
