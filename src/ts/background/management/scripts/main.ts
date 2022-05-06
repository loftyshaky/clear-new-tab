import { Management } from 'webextension-polyfill-ts';

import { i_data } from 'shared/internal';
import { s_browser_theme } from 'background/internal';

export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
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

            if (ext_info.type === 'theme' && ext_info.id === settings.id_of_last_installed_theme) {
                await ext.storage_set({ id_of_last_installed_theme: '' });
            }
        }, 'cnt_1370');
}

we.management.onEnabled.addListener(
    (ext_info: Management.ExtensionInfo): Promise<void> =>
        err_async(async () => {
            if (ext_info.type === 'theme') {
                s_browser_theme.Main.i().theme_id = ext_info.id;
                s_browser_theme.Main.i().force_theme_redownload = false;

                await s_browser_theme.Main.i().get_theme_background();
            }
        }, 'cnt_1012'),
);

we.management.onDisabled.addListener(
    (ext_info: Management.ExtensionInfo): Promise<void> =>
        err_async(async () => {
            await Main.i().reset_id_of_last_installed_theme({ ext_info });
        }, 'cnt_1012'),
);

we.management.onUninstalled.addListener(
    (ext_info: Management.ExtensionInfo): Promise<void> =>
        err_async(async () => {
            await Main.i().reset_id_of_last_installed_theme({ ext_info });
        }, 'cnt_1012'),
);
