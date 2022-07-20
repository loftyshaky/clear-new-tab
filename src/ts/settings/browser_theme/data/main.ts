import { makeObservable, action } from 'mobx';

import { i_browser_theme, i_db } from 'shared/internal';
import { d_backgrounds } from 'settings/internal';

export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    private constructor() {
        makeObservable(this, {
            delete_theme_background: action,
        });
    }

    public delete_theme_background = ({
        theme_id,
        force_theme_redownload,
    }: i_browser_theme.GetThemeBackground): Promise<void> =>
        err_async(async () => {
            let ids_to_delete: string[] = [];

            if (!data.settings.keep_old_theme_backgrounds) {
                const backgrounds_to_delete: i_db.Background[] =
                    d_backgrounds.Main.i().backgrounds.filter(
                        (background: i_db.Background): boolean =>
                            err(
                                () => n(background.theme_id) && background.theme_id !== theme_id,
                                'cnt_1159',
                            ),
                    );

                ids_to_delete = backgrounds_to_delete.map((background: i_db.Background): string =>
                    err(() => background.id, 'cnt_1160'),
                );
            }

            if (force_theme_redownload) {
                const current_theme_background: i_db.Background | undefined =
                    d_backgrounds.Main.i().backgrounds.find(
                        (background: i_db.Background): boolean =>
                            err(
                                () => n(background.theme_id) && background.theme_id === theme_id,
                                'cnt_1161',
                            ),
                    );

                if (n(current_theme_background)) {
                    ids_to_delete.push(current_theme_background.id);
                }
            }

            await d_backgrounds.BackgroundDeletion.i().trigger_delete({ ids: ids_to_delete });
        }, 'cnt_1162');
}
