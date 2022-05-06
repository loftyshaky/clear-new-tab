import { s_announcement, s_browser_theme } from 'background/internal';

we.runtime.onInstalled.addListener(
    (details): Promise<void> =>
        err_async(async () => {
            if (details.reason === 'install') {
                s_announcement.Main.i().installing_ext = true;

                await s_browser_theme.Main.i().get_theme_background({
                    clear_new_tab_install: true,
                });
            }
        }, 'cnt_1014'),
);
