import { runInAction } from 'mobx';

import { d_optional_permissions, i_optional_permissions } from '@loftyshaky/shared/settings';
import { d_data } from 'shared_clean/internal';

class Class {
    static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line max-len
    public optional_permission_checkbox_dict: i_optional_permissions.OptionalPermissionCheckboxDict =
        {
            paste_btn_is_visible: { permissions: ['clipboardRead'], origins: [] },
            allow_downloading_img_by_link: { permissions: [], origins: ['<all_urls>'] },
        };

    public check_if_contains_permission = ({ name }: { name: string }): Promise<boolean> =>
        err_async(
            async () => we.permissions.contains(this.optional_permission_checkbox_dict[name]),
            'cnt_1531',
        );

    public set_permission = ({ name }: { name: string }): Promise<boolean> =>
        err_async(
            async () =>
                d_optional_permissions.Permission.set({
                    name,
                    optional_permission_checkbox_dict: this.optional_permission_checkbox_dict,
                    set_checkbox_val: false,
                }),
            'cnt_1532',
        );

    public change_clipboard_read_permission = (): Promise<void> =>
        err_async(async () => {
            const clipboard_read_permission: boolean = await this.check_if_contains_permission({
                name: 'paste_btn_is_visible',
            });
            const permission_granted: boolean = await this.set_permission({
                name: 'paste_btn_is_visible',
            });

            runInAction(() =>
                err(() => {
                    data.settings.prefs.clipboard_read_permission = permission_granted;
                    data.settings.prefs.paste_btn_is_visible =
                        !clipboard_read_permission || permission_granted
                            ? data.settings.prefs.paste_btn_is_visible
                            : false;
                }, 'cnt_1534'),
            );

            d_data.Manipulation.send_msg_to_update_settings({
                settings: {
                    ...data.settings,
                    prefs: data.settings.prefs,
                },
                update_instantly: true,
            });
        }, 'cnt_1533');
}

export const Permissions = Class.get_instance();
