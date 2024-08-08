import { Management } from 'webextension-polyfill';

import { s_browser_theme, s_management } from 'background/internal';

we.management.onEnabled.addListener(
    (ext_info: Management.ExtensionInfo): Promise<void> =>
        err_async(async () => {
            if (ext_info.type === 'theme') {
                s_browser_theme.Backgrounds.theme_id = ext_info.id;
                s_browser_theme.Backgrounds.force_theme_redownload = false;

                await s_browser_theme.Backgrounds.attempt_to_run_try_to_get_theme_background();
            }
        }, 'cnt_1012'),
);

we.management.onDisabled.addListener(
    (ext_info: Management.ExtensionInfo): Promise<void> =>
        err_async(async () => {
            await s_management.Extensions.reset_id_of_last_installed_theme({ ext_info });
        }, 'cnt_1012'),
);

we.management.onUninstalled.addListener(
    (ext_info: Management.ExtensionInfo): Promise<void> =>
        err_async(async () => {
            await s_management.Extensions.reset_id_of_last_installed_theme({ ext_info });
        }, 'cnt_1012'),
);
