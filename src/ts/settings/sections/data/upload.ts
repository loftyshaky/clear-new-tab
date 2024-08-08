import { makeObservable, action } from 'mobx';
import { d_sections } from 'settings/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
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
                d_sections.Sections.sections as any
            ).background_upload.inputs.upload_background.loading_msg_is_visible = is_visible;
        }, 'cnt_1284');

    public set_visibility_of_error_msg = ({ is_visible }: { is_visible: boolean }): void =>
        err(() => {
            (
                d_sections.Sections.sections as any
            ).background_upload.inputs.upload_background.error_msg_is_visible = is_visible;
        }, 'cnt_1285');
}

export const Upload = Class.get_instance();
