import { action, makeObservable } from 'mobx';

import { d_backgrounds } from 'settings/internal';
import type { i_browser_theme } from 'shared_clean/internal';
import { d_browser_theme } from 'shared_clean/internal';

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

            await d_backgrounds.BackgroundDeletion.trigger_delete({
                ids: ids_to_delete,
            });
        }, 'cnt_1162');

    public refresh_theme_backgrounds = (): Promise<void> =>
        err_async(async () => {
            const response = await ext.send_msg_resp({
                msg: 'get_installed',
            });

            if (
                data.settings.prefs.mode === 'theme_background' &&
                (!n(response) || typeof response === 'string')
            ) {
                const theme_id: string | undefined = response;

                if (n(theme_id)) {
                    await ext.send_msg_resp({
                        msg: 'get_theme_background',
                        force_theme_redownload: false,
                        triggered_by_load_theme_background_btn: false,
                    });
                } else {
                    await d_backgrounds.CurrentBackground.set_current_background_id_to_id_of_first_background();
                }
            } else {
                await d_backgrounds.CurrentBackground.set_current_background_id_to_id_of_first_background();
            }
        }, 'cnt_1424');
}

export const Backgrounds = Class.get_instance();
