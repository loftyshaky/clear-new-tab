import { i_data } from 'shared_clean/internal';
import { s_announcement } from '@loftyshaky/shared/shared_clean';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public display_announcement = (): Promise<void> =>
        err_async(async () => {
            const settings: i_data.Settings = await ext.storage_get();

            if (
                env.mode === 'production' &&
                n(settings.version) &&
                ((env.browser === 'chrome' && settings.version === '5.10.0') ||
                    (env.browser === 'edge' && settings.version === '5.10.2'))
            ) {
                s_announcement.Visibility.display();
            }
        }, 'cnt_1369');
}

export const Visibility = Class.get_instance();
