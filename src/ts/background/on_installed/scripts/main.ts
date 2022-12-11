import { s_data } from 'shared/internal';
import { s_announcement, s_browser_theme } from 'background/internal';

we.runtime.onInstalled.addListener(
    (details): Promise<void> =>
        err_async(async () => {
            if (details.reason === 'install') {
                s_announcement.Main.i().installing_ext = true;

                await s_data.Main.i().set_from_storage();
                await s_browser_theme.Main.i().get_theme_background();
            }
        }, 'cnt_1014'),
);
