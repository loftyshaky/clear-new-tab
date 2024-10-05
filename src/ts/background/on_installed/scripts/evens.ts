import { Runtime } from 'webextension-polyfill';

import { db, s_data } from 'shared_clean/internal';
import { s_browser_theme } from 'background/internal';

we.runtime.onInstalled.addListener(
    (details: Runtime.OnInstalledDetailsType): Promise<void> =>
        err_async(async () => {
            if (details.reason === 'install') {
                s_data.Settings.init_defaults();
                await s_data.Manipulation.set_from_storage();
                db.init();
                await s_browser_theme.Backgrounds.attempt_to_run_try_to_get_theme_background();

                we.runtime.openOptionsPage();
            }
        }, 'cnt_1014'),
);
