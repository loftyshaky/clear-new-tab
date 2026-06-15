import { runInAction } from 'mobx';

import type { i_optional_permissions as loftyshaky_i_optional_permissions } from '@loftyshaky/shared/settings';
import { d_optional_permissions } from '@loftyshaky/shared/settings';
import type { i_optional_permissions } from 'settings/internal';
import { d_data } from 'shared_clean/internal';

class Class {
    static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    public contains_permission: i_optional_permissions.ContainsPermission = {
        paste_btn_is_visible: false,
        allow_downloading_img_by_link: false,
    };

    public optional_permission_checkbox_dict: loftyshaky_i_optional_permissions.OptionalPermissionCheckboxDict =
        {
            paste_btn_is_visible: { permissions: ['clipboardRead'], origins: [] },
            allow_downloading_img_by_link: {
                permissions: [],
                origins: ['<all_urls>'],
            },
        };

    public set_contains_permission_vals = (): Promise<void> =>
        err_async(async () => {
            await Promise.all(
                Object.keys(this.contains_permission).map(
                    async (permission_name: string): Promise<void> =>
                        err_async(async () => {
                            this.contains_permission[permission_name] =
                                await we.permissions.contains(
                                    this.optional_permission_checkbox_dict[permission_name],
                                );
                        }, 'cnt_1552'),
                ),
            );
        }, 'cnt_1551');

    public check_if_contains_permission = ({ name }: { name: string }): Promise<boolean> =>
        err_async(
            async () => we.permissions.contains(this.optional_permission_checkbox_dict[name]),
            'cnt_1531',
        );

    public set_permission = ({ name }: { name: string }): Promise<boolean> =>
        err_async(async () => {
            const granted: boolean = await d_optional_permissions.Permission.set({
                name,
                contains_permission: this.contains_permission[name],
                optional_permission_checkbox_dict: this.optional_permission_checkbox_dict,
                set_checkbox_val: false,
            });

            await this.set_contains_permission_vals();

            return granted;
        }, 'cnt_1532');

    public change_clipboard_read_permission = (): Promise<void> =>
        err_async(async () => {
            const permission_name: string = 'paste_btn_is_visible';
            const clipboard_read_permission: boolean = this.contains_permission[permission_name];

            const permission_granted: boolean = await this.set_permission({
                name: permission_name,
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

            await d_data.Manipulation.send_msg_to_update_settings({
                settings: {
                    ...data.settings,
                    prefs: data.settings.prefs,
                },
                update_instantly: true,
            });
        }, 'cnt_1533');
}

export const Permissions = Class.get_instance();
