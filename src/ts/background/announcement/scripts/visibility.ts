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
            if (
                env.mode === 'production' &&
                n(data.settings.prefs.version) &&
                ((env.browser === 'chrome' && data.settings.prefs.version === '5.10.0') ||
                    (env.browser === 'edge' && data.settings.prefs.version === '5.10.2'))
            ) {
                s_announcement.Visibility.display();
            }
        }, 'cnt_1369');
}

export const Visibility = Class.get_instance();
