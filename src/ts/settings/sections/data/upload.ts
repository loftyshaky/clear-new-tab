import { makeObservable, action } from 'mobx';
import { d_sections } from 'settings/internal';

export class Upload {
    private static i0: Upload;

    public static i(): Upload {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    private constructor() {
        makeObservable(this, {
            set_visibility_of_loading_msg: action,
            set_visibility_of_error_msg: action,
        });
    }

    public set_visibility_of_loading_msg = ({ is_visible }: { is_visible: boolean }): void =>
        err(() => {
            (
                d_sections.Main.i().sections as any
            ).background_upload.inputs.upload_background.loading_msg_is_visible = is_visible;
        }, 'cnt_64546');

    public set_visibility_of_error_msg = ({ is_visible }: { is_visible: boolean }): void =>
        err(() => {
            (
                d_sections.Main.i().sections as any
            ).background_upload.inputs.upload_background.error_msg_is_visible = is_visible;
        }, 'cnt_64564');
}
