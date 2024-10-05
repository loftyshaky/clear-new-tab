import { Management } from 'webextension-polyfill';

import { s_data } from 'shared_clean/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public get_all_exts = (): Promise<Management.ExtensionInfo[]> =>
        err_async(async () => we.management.getAll(), 'cnt_1011');

    public reset_id_of_last_installed_theme = ({
        ext_info,
    }: {
        ext_info: Management.ExtensionInfo;
    }): Promise<void> =>
        err_async(async () => {
            if (
                data.settings.prefs.mode === 'theme_background' &&
                ext_info.type === 'theme' &&
                ext_info.id === data.settings.prefs.id_of_last_installed_theme
            ) {
                data.settings.prefs.id_of_last_installed_theme = '';

                await s_data.Manipulation.update_settings({
                    settings: data.settings,
                    load_settings: true,
                });

                await ext.send_msg_resp({
                    msg: 'set_current_background_id_to_id_of_first_background',
                });
                ext.send_msg({ msg: 'update_settings_settings' });
            }
        }, 'cnt_1370');
}

export const Extensions = Class.get_instance();
