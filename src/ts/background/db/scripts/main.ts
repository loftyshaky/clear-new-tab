import Dexie from 'dexie';

import { s_browser_theme } from 'background/internal';

export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public delete_old_db = (): Promise<void> =>
        err_async(async () => {
            const old_database_exists: boolean = await Dexie.exists('Clear New Tab');

            if (old_database_exists) {
                await Dexie.delete('Clear New Tab');

                await s_browser_theme.Main.i().attempt_to_run_try_to_get_theme_background();
            }
        }, 'cnt_1008');
}
