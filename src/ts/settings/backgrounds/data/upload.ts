import { o_inputs, d_inputs } from '@loftyshaky/shared/inputs';
import { d_backgrounds as d_backgrounds_shared_clean, i_db } from 'shared_clean/internal';
import { d_progress } from 'shared/internal';
import {
    d_backgrounds,
    d_protecting_screen,
    s_optional_permissions,
    s_scrollable,
} from 'settings/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public upload_with_browse_btn = async ({
        files,
        theme_id,
        background_props,
        show_error_in_upload_box = true,
        update_current_background_id = true,
    }: {
        files: File[] | string[];
        theme_id?: string;
        background_props?: i_db.BackgroundProps;
        show_error_in_upload_box?: boolean;
        update_current_background_id?: boolean;
    }): Promise<void> => {
        await d_backgrounds_shared_clean.Upload.upload_with_browse_btn({
            files,
            theme_id,
            backgrounds: d_backgrounds.Backgrounds.backgrounds,
            background_props,
            show_error_in_upload_box,
            update_current_background_id,
            merge_backgrounds: d_backgrounds.Backgrounds.merge_backgrounds,
            set_background_as_current: d_backgrounds.CurrentBackground.set_background_as_current,
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
    };

    public upload_with_paste_input = (
        { input }: { input: o_inputs.Text },
        e: ClipboardEvent,
    ): Promise<void> =>
        err_async(async () => {
            d_protecting_screen.Visibility.show();
            d_inputs.Text.set_loading_placeholder_text({ input });

            try {
                d_inputs.Val.set({
                    val: '',
                    input,
                });

                if (n(e.clipboardData)) {
                    const pasted_img_clipboard_item: DataTransferItem | undefined = [
                        ...e.clipboardData.items,
                    ].find((clipboard_item: DataTransferItem): boolean =>
                        err(() => clipboard_item.type.includes('image'), 'cnt_1138'),
                    );
                    const pasted_img_file_object: File | null = n(pasted_img_clipboard_item)
                        ? pasted_img_clipboard_item.getAsFile()
                        : null;

                    const clipboard_text: string = e.clipboardData.getData('text');
                    const input_given_text: boolean = clipboard_text !== '';

                    let img_file: File | undefined;
                    let blob_is_of_allowed_img_type: boolean = true;

                    if (
                        data.ui.allow_downloading_img_by_link &&
                        data.settings.prefs.download_img_when_link_given &&
                        input_given_text
                    ) {
                        const response: Response = await globalThis.fetch(clipboard_text);
                        const blob: Blob = await response.blob();
                        blob_is_of_allowed_img_type = [
                            'image/gif',
                            'image/jpeg',
                            'image/jpg',
                            'image/png',
                        ].includes(blob.type);

                        if (blob_is_of_allowed_img_type) {
                            img_file = this.convert_blob_to_file_object({ blob });
                        }
                    } else {
                        img_file = n(pasted_img_file_object) ? pasted_img_file_object : undefined;
                    }

                    if (blob_is_of_allowed_img_type) {
                        await this.upload_with_browse_btn({
                            files: n(img_file) ? [img_file] : [clipboard_text],
                            show_error_in_upload_box: false,
                        });
                    }

                    d_inputs.Text.clear_placeholder_text({ input });
                }
            } catch (error_obj: any) {
                show_err_ribbon(error_obj, 'cnt_1139', { silent: true }); // paste in paste input wrong link to cause this error

                d_inputs.Text.set_error_placeholder_text({ input });
            }

            s_scrollable.Scrollable.set_scroll_position({
                scrollable_type: 'backgrounds',
            });
            d_protecting_screen.Visibility.hide();
        }, 'cnt_1140');

    public upload_with_paste_btn = (): Promise<void> =>
        err_async(async () => {
            const clipboard_read_permission: boolean =
                await s_optional_permissions.Permissions.check_if_contains_permission({
                    name: 'paste_btn_is_visible',
                });

            if (clipboard_read_permission) {
                document.execCommand('paste');
            } else {
                show_notification({
                    error_msg_key: 'permissions_are_missing_error',
                    notification_type: 'error',
                    hide_delay: 15000,
                });
            }
        }, 'cnt_1141');

    private convert_blob_to_file_object = ({ blob }: { blob: Blob }): File =>
        err(
            () => new File([blob], '', { type: blob.type }), // '' is file name, it means that file object was created from blob object
            'cnt_1142',
        );
}

export const Upload = Class.get_instance();
