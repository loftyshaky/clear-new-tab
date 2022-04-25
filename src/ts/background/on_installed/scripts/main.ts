import { s_announcement } from '@loftyshaky/shared/announcement';
import { s_browser_theme } from 'background/internal';

we.runtime.onInstalled.addListener(
    (details): Promise<void> =>
        err_async(async () => {
            if (details.reason === 'install') {
                await s_browser_theme.Main.i().get_theme_background({
                    clear_new_tab_install: true,
                });
            } else if (details.reason === 'update') {
                if (
                    env.mode === 'production' &&
                    ((env.browser === 'chrome' && details.previousVersion === '5.10.0') ||
                        (env.browser === 'edge' && details.previousVersion === '5.10.2'))
                ) {
                    s_announcement.Display.i().display_announcement();
                }
            }
        }, 'cnt_53783'),
);
