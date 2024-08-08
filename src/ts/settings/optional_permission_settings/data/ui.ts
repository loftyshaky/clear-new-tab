import { makeObservable, action } from 'mobx';

import { d_optional_permission_settings } from 'settings/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {
        makeObservable(this, {
            set_ui_vals: action,
        });
    }

    public set_ui_vals = (): Promise<void> =>
        err_async(async () => {
            data.ui.paste_btn_is_visible = await we.permissions.contains(
                d_optional_permission_settings.Permission.optional_permission_checkbox_dict
                    .paste_btn_is_visible,
            );

            data.ui.allow_downloading_img_by_link = await we.permissions.contains(
                d_optional_permission_settings.Permission.optional_permission_checkbox_dict
                    .allow_downloading_img_by_link,
            );
        }, 'cnt_1225');
}

export const Ui = Class.get_instance();
