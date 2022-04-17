import { i_browser_theme, i_data } from 'shared/internal';

import { s_tabs } from 'background/internal';

export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    private need_to_get_theme_background: boolean = false;

    public theme_id: string | undefined;
    public force_theme_redownload: boolean = false;

    public get_theme_background = ({
        clear_new_tab_install = false,
    }: {
        clear_new_tab_install?: boolean;
    } = {}): Promise<void> =>
        err_async(async () => {
            this.need_to_get_theme_background = true;

            const settings: i_data.Settings = await ext.storage_get();

            const options_page_is_open: boolean = n(s_tabs.TabIds.i().options_page_tab_id);

            if (settings.mode === 'theme_background' || clear_new_tab_install) {
                we.runtime.openOptionsPage();
            }

            if (options_page_is_open) {
                ext.send_msg({ msg: 'try_to_get_theme_background' });
            }
        }, 'cnt_84214');

    public get_theme_background_response = (): i_browser_theme.GetThemeBackground =>
        err(
            () => ({
                theme_id: this.theme_id,
                force_theme_redownload: this.force_theme_redownload,
            }),
            'cnt_75356',
        );

    public get_id_of_currently_added_theme = (): string | undefined =>
        err(() => this.theme_id, 'cnt_74356');
}
