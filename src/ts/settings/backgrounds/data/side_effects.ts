import { d_pagination, d_protecting_screen, d_sections, s_scrollable } from 'settings/internal';

export class SideEffects {
    private static i0: SideEffects;

    public static i(): SideEffects {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public upload_success = (): Promise<void> =>
        err_async(async () => {
            await d_pagination.Page.i().set_last();

            s_scrollable.Main.i().set_scroll_position({
                scrollable_type: 'backgrounds',
            });
            d_protecting_screen.Visibility.i().hide();
        }, 'cnt_1479');

    public upload_error = ({
        show_error_in_upload_box = true,
    }: {
        show_error_in_upload_box?: boolean;
    }): Promise<void> =>
        err_async(async () => {
            if (show_error_in_upload_box) {
                d_sections.Upload.i().set_visibility_of_error_msg({ is_visible: true });
            }

            s_scrollable.Main.i().set_scroll_position({
                scrollable_type: 'backgrounds',
            });
            d_protecting_screen.Visibility.i().hide();
        }, 'cnt_1480');
}
