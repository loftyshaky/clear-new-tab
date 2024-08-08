import { makeObservable, action } from 'mobx';

import { d_browser_theme, i_browser_theme } from 'shared_clean/internal';
import { d_backgrounds } from 'settings/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {
        makeObservable(this, {
            delete_theme_backgrounds: action,
        });
    }

    public delete_theme_backgrounds = ({
        theme_id,
        force_theme_redownload,
    }: i_browser_theme.GetThemeBackground): Promise<void> =>
        err_async(async () => {
            const ids_to_delete: string[] =
                await d_browser_theme.Backgrounds.get_ids_of_theme_backgrounds_to_delete({
                    backgrounds: d_backgrounds.Backgrounds.backgrounds,
                    theme_id,
                    force_theme_redownload,
                });

            await d_backgrounds.BackgroundDeletion.trigger_delete({ ids: ids_to_delete });
        }, 'cnt_1162');

    public refresh_theme_backgrounds = (): Promise<void> =>
        err_async(async () => {
            const theme_id: string | undefined = await ext.send_msg_resp({ msg: 'get_installed' });

            if (data.settings.mode === 'theme_background') {
                if (n(theme_id)) {
                    await ext.send_msg_resp({
                        msg: 'get_theme_background',
                        force_theme_redownload: false,
                        triggered_by_load_theme_background_btn: false,
                    });
                } else {
                    // eslint-disable-next-line max-len
                    await d_backgrounds.CurrentBackground.set_current_background_id_to_id_of_first_background();
                }
            }
        }, 'cnt_1424');
}

export const Backgrounds = Class.get_instance();
