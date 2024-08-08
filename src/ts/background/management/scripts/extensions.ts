import { Management } from 'webextension-polyfill';

import { s_data, i_data } from 'shared_clean/internal';

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
            const settings: i_data.Settings = await ext.storage_get();

            if (
                settings.mode === 'theme_background' &&
                ext_info.type === 'theme' &&
                ext_info.id === settings.id_of_last_installed_theme
            ) {
                settings.id_of_last_installed_theme = '';

                await s_data.Data.update_settings({
                    settings,
                });

                await ext.send_msg_resp({
                    msg: 'set_current_background_id_to_id_of_first_background',
                });
                ext.send_msg({ msg: 'update_settings_settings' });
            }
        }, 'cnt_1370');
}

export const Extensions = Class.get_instance();
