import { s_browser_theme, i_browser_theme, i_data } from 'shared/internal';

export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public theme_id: string | undefined;
    public force_theme_redownload: boolean = false;

    public get_theme_background = (): Promise<void> =>
        err_async(async () => {
            const settings: i_data.Settings = await ext.storage_get();

            const options_page_is_open: boolean = n(settings.options_page_tab_id);
            const already_tried_install_this_theme: boolean =
                this.theme_id === settings.id_of_last_installed_theme;

            const is_local_theme = await s_browser_theme.ThemeId.i().check_if_theme_is_local({
                theme_id: this.theme_id,
            });

            if (!is_local_theme) {
                if (settings.mode === 'theme_background' && !already_tried_install_this_theme) {
                    we.runtime.openOptionsPage();
                }

                if (options_page_is_open && !already_tried_install_this_theme) {
                    ext.send_msg({ msg: 'try_to_get_theme_background' });
                }
            }
        }, 'cnt_1005');

    public get_theme_background_response = (): i_browser_theme.GetThemeBackground =>
        err(
            () => ({
                theme_id: this.theme_id,
                force_theme_redownload: this.force_theme_redownload,
            }),
            'cnt_1006',
        );

    public get_id_of_currently_added_theme = (): string | undefined =>
        err(() => this.theme_id, 'cnt_1007');
}
