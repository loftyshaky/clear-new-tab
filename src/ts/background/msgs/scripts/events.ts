import type { Tabs } from 'webextension-polyfill';

import type { i_error, t } from '@loftyshaky/shared/shared_clean';
import { s_backgrounds, s_browser_theme, s_home_btn, s_scheduler } from 'background/internal';
import { s_background, s_data, s_offscreen, s_tabs } from 'shared_clean/internal';

we.runtime.onMessage.addListener(
    (msg: t.Any): t.Any =>
        err(() => {
            const msg_str: string = msg.msg;

            const try_to_change_background = (): void =>
                err(() => {
                    void s_background.BackgroundChange.try_to_change_background({
                        allow_to_start_slideshow_timer: n(msg.allow_to_start_slideshow_timer)
                            ? msg.allow_to_start_slideshow_timer
                            : true,
                        force_change: n(msg.force_change) ? msg.force_change : false,
                        force_update: n(msg.force_update) ? msg.force_update : false,
                    });
                }, 'cnt_1542');

            if (msg_str === 'react_to_init_new_tab') {
                return s_offscreen.FirefoxMsgsAlt.set_current_background_data({
                    mode: data.settings.prefs.mode,
                })
                    .then(() => {
                        return ext.get_active_tab();
                    })
                    .then((active_tab: Tabs.Tab | undefined) => {
                        return s_tabs.TabIds.push_tab_id({ active_tab: active_tab });
                    })
                    .then(() => {
                        return s_tabs.TabIds.set_last_visited_new_tab_id({
                            active_tab: msg.active_tab,
                            called_from_new_tab_init: msg.called_from_new_tab_init,
                        });
                    })
                    .then(() => {
                        try_to_change_background();
                    })
                    .then(() => {
                        return true;
                    })
                    .catch((error_obj: i_error.ErrorObj) => show_err_ribbon(error_obj, 'cnt_1485'));
            }

            if (msg_str === 'reload_ext') {
                we.runtime.reload();

                return Promise.resolve(true);
            }

            if (msg_str === 'wait_until_cache_polulated') {
                return s_data.Manipulation.wait_until_cache_polulated();
            }

            if (msg_str === 'update_settings_background') {
                s_data.Manipulation.service_worker_woken_up_by_update_settings_background_msg = true;

                if (n(msg.update_instantly) && msg.update_instantly) {
                    return s_data.Manipulation.update_settings({
                        settings: msg.settings,
                        replace: n(msg.replace) ? msg.replace : false,
                        transform: n(msg.transform) ? msg.transform : false,
                        transform_force: n(msg.transform_force) ? msg.transform_force : false,
                        load_settings: n(msg.load_settings) ? msg.load_settings : false,
                        restore_back_up: n(msg.restore_back_up) ? msg.restore_back_up : false,
                        update_background: n(msg.update_background) ? msg.update_background : false,
                    })
                        .then(() => true)
                        .catch((error_obj: i_error.ErrorObj) =>
                            show_err_ribbon(error_obj, 'cnt_1483'),
                        );
                }

                return s_data.Manipulation.update_settings_debounce(
                    msg.settings,
                    n(msg.replace) ? msg.replace : false,
                    n(msg.transform) ? msg.transform : false,
                    n(msg.transform_force) ? msg.transform_force : false,
                    n(msg.load_settings) ? msg.load_settings : false,
                    n(msg.restore_back_up) ? msg.restore_back_up : false,
                    n(msg.update_background) ? msg.update_background : false,
                )
                    .then(() => true)
                    .catch((error_obj: i_error.ErrorObj) => show_err_ribbon(error_obj, 'cnt_1484'));
            }

            if (msg_str === 'get_defaults') {
                return Promise.resolve(s_data.Settings.defaults);
            }

            if (msg_str === 'get_theme_background') {
                void s_browser_theme.Backgrounds.get_theme_background({
                    theme_id: undefined,
                    force_theme_redownload: msg.force_theme_redownload,
                    triggered_by_load_theme_background_btn:
                        msg.triggered_by_load_theme_background_btn,
                });

                return Promise.resolve(true);
            }

            if (msg_str === 'get_background') {
                try_to_change_background();

                return Promise.resolve(true);
            }

            if (msg_str === 'get_installed') {
                return s_browser_theme.ThemeId.get_installed()
                    .then((response) => response)
                    .catch((error_obj: i_error.ErrorObj) => show_err_ribbon(error_obj, 'cnt_1486'));
            }

            if (msg_str === 'uploading_theme_background_now') {
                return Promise.resolve(s_browser_theme.Backgrounds.getting_theme_background);
            }

            if (msg_str === 'clear_slideshow_timer') {
                return s_background.BackgroundChange.clear_slideshow_timer({ force: false })
                    .then(() => true)
                    .catch((error_obj: i_error.ErrorObj) => show_err_ribbon(error_obj, 'cnt_1487'));
            }

            if (msg_str === 'open_theme_background') {
                s_browser_theme.LinkToImage.open();

                return Promise.resolve(true);
            }

            if (msg_str === 'open_background_preview') {
                s_backgrounds.Preview.open({ background_id: msg.background_id });

                return Promise.resolve(true);
            }

            if (msg_str === 'schedule_background_display') {
                return s_scheduler.Scheduler.schedule_background_display()
                    .then(() => true)
                    .catch((error_obj: i_error.ErrorObj) => show_err_ribbon(error_obj, 'cnt_1488'));
            }

            if (msg_str === 'open_default_new_tab_page') {
                s_home_btn.HomeBtn.open_default_new_tab_page();

                return Promise.resolve(true);
            }

            return false;
        }, 'cnt_1013'),
);
