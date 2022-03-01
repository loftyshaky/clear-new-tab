import { s_browser_theme } from 'background/internal';

we.runtime.onInstalled.addListener(
    (details): Promise<void> =>
        err_async(async () => {
            if (details.reason === 'install') {
                await s_browser_theme.Main.i().get_theme_background({
                    clear_new_tab_install: true,
                });
            }
        }, 'cnt_53783'),
);
