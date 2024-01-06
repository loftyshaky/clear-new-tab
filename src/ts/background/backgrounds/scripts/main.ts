import { s_background, s_data, i_data } from 'shared/internal';

export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public update_background = ({ background_id }: { background_id: string }): Promise<void> =>
        err_async(async () => {
            const settings: i_data.Settings = await ext.storage_get();

            if (settings.current_background_id !== background_id) {
                settings.current_background_id = background_id;

                await s_data.Main.i().update_settings({
                    settings,
                });

                if (settings.slideshow) {
                    await s_background.BackgroundChange.i().update_background({ no_tr: false });
                }
            }
        }, 'cnt_1001');
}
