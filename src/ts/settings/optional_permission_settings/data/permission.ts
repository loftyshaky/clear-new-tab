import { d_optional_permissions, i_optional_permissions } from '@loftyshaky/shared/settings';

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

    public set = ({ name }: { name: string }): Promise<void> =>
        err_async(async () => {
            await d_optional_permissions.Permission.set({
                name,
                optional_permission_checkbox_dict: this.optional_permission_checkbox_dict,
            });
        }, 'cnt_1226');
}

export const Permission = Class.get_instance();
