import { i_browser_theme, i_db } from 'shared_clean/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public get_ids_of_theme_backgrounds_to_delete = ({
        theme_id,
        force_theme_redownload,
        backgrounds,
    }: i_browser_theme.GetThemeBackgroundWithBackgrounds): Promise<string[]> =>
        err_async(async () => {
            let ids_to_delete: string[] = [];

            if (!data.settings.prefs.keep_old_theme_backgrounds) {
                const backgrounds_to_delete: i_db.Background[] = backgrounds.filter(
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
                const current_theme_background: i_db.Background | undefined = backgrounds.find(
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

            return ids_to_delete;
        }, 'cnt_1503');
}

export const Backgrounds = Class.get_instance();
