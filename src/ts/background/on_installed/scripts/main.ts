import { Runtime } from 'webextension-polyfill';

import { db, s_data } from 'shared/internal';
import { s_browser_theme } from 'background/internal';

we.runtime.onInstalled.addListener(
    (details: Runtime.OnInstalledDetailsType): Promise<void> =>
        err_async(async () => {
            if (details.reason === 'install') {
                s_data.Main.i().init_defaults();
                await s_data.Main.i().set_from_storage();
                db.init_db();
                await s_browser_theme.Main.i().attempt_to_run_try_to_get_theme_background();

                we.runtime.openOptionsPage();
            }
        }, 'cnt_1014'),
);
