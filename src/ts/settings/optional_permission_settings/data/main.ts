import { makeObservable, action } from 'mobx';

import { d_optional_permissions, i_optional_permissions } from '@loftyshaky/shared/settings';

export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    private constructor() {
        makeObservable(this, {
            set_ui_vals: action,
        });
    }

    // eslint-disable-next-line max-len
    public optional_permission_checkbox_dict: i_optional_permissions.OptionalPermissionCheckboxDict =
        {
            paste_btn_is_visible: { permissions: ['clipboardRead'], origins: [] },
            allow_downloading_img_by_link: { permissions: [], origins: ['<all_urls>'] },
        };

    public set_ui_vals = (): Promise<void> =>
        err_async(async () => {
            data.ui.paste_btn_is_visible = await we.permissions.contains(
                this.optional_permission_checkbox_dict.paste_btn_is_visible,
            );

            data.ui.allow_downloading_img_by_link = await we.permissions.contains(
                this.optional_permission_checkbox_dict.allow_downloading_img_by_link,
            );
        }, 'cnt_64345');

    public set_permission = ({ name }: { name: string }): Promise<void> =>
        err_async(async () => {
            await d_optional_permissions.Main.i().set_permission({
                name,
                optional_permission_checkbox_dict: this.optional_permission_checkbox_dict,
            });
        }, 'cnt_56336');
}
