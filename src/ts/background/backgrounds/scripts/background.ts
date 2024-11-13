import { s_background, s_data } from 'shared_clean/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public update_background = ({ background_id }: { background_id: string }): Promise<void> =>
        err_async(async () => {
            if (data.settings.prefs.current_background_id !== background_id) {
                data.settings.prefs.current_background_id = background_id;

                await s_data.Manipulation.update_settings({
                    settings: data.settings,
                    load_settings: true,
                });

                if (data.settings.prefs.slideshow) {
                    await s_background.BackgroundChange.update_background({
                        no_tr: false,
                    });
                }
            }
        }, 'cnt_1001');
}

export const Background = Class.get_instance();
