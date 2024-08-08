import Dexie from 'dexie';

import { s_browser_theme } from 'background/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public delete_old_db = (): Promise<void> =>
        err_async(async () => {
            const old_database_exists: boolean = await Dexie.exists('Clear New Tab');

            if (old_database_exists) {
                await Dexie.delete('Clear New Tab');

                await s_browser_theme.Backgrounds.attempt_to_run_try_to_get_theme_background();
            }
        }, 'cnt_1008');
}

export const Db = Class.get_instance();
