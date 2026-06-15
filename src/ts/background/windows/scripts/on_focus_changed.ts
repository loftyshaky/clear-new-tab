import { s_background } from 'shared_clean/internal';

we.windows.onFocusChanged.addListener(
    // start or stop slideshow when focusing unfocusing browser window
    (window_id: number): Promise<void> =>
        err_async(async () => {
            const user_is_in_new_tab: unknown =
                await s_background.BackgroundChange.check_if_user_is_in_new_tab();

            if (window_id === we.windows.WINDOW_ID_NONE) {
                // switched to different app (in Chrome, fires only when minimizing, but when switching to different app from taskbar it doesn't (bug report: https://issues.chromium.org/issues/41116352). In firefox, works fine.)
                void s_background.BackgroundChange.clear_slideshow_timer();
            } else if (user_is_in_new_tab) {
                if (data.settings.prefs.slideshow) {
                    void s_background.BackgroundChange.try_to_change_background({
                        allow_to_start_slideshow_timer: true,
                    });
                }
            }
        }, 'cnt_1553'),
);
