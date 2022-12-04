import { t } from '@loftyshaky/shared';
import { s_background, s_data, s_tabs } from 'shared/internal';
import {
    s_backgrounds,
    s_browser_theme,
    s_home_btn,
    s_management,
    s_scheduler,
} from 'background/internal';

we.runtime.onMessage.addListener(
    (msg: t.Msg): Promise<any> =>
        err_async(async () => {
            const msg_str: string = msg.msg;

            if (msg_str === 'reload_ext') {
                we.runtime.reload();
            } else if (msg_str === 'update_settings_background') {
                s_data.Main.i().service_worker_woken_up_by_update_settings_background_msg = true;

                if (n(msg.update_instantly) && msg.update_instantly) {
                    await s_data.Main.i().update_settings({
                        settings: msg.settings,
                        update_background: msg.update_background,
                        transform: n(msg.transform) ? msg.transform : false,
                    });
                } else {
                    s_data.Main.i().update_settings_debounce(
                        msg.settings,
                        msg.update_background,
                        n(msg.transform) ? msg.transform : false,
                    );
                }

                ext.send_msg({ msg: 'update_settings_new_tab' });
            } else if (msg_str === 'get_defaults') {
                return s_data.Main.i().defaults;
            } else if (msg_str === 'push_tab_id') {
                await s_tabs.TabIds.i().push_tab_id();
                await s_tabs.TabIds.i().set_last_visited_new_tab_id();
            } else if (msg_str === 'get_background') {
                s_background.BackgroundChange.i().try_to_change_background({
                    allow_to_start_slideshow_timer: n(msg.allow_to_start_slideshow_timer)
                        ? msg.allow_to_start_slideshow_timer
                        : true,
                    force_change: n(msg.force_change) ? msg.force_change : false,
                    force_update: n(msg.force_update) ? msg.force_update : false,
                });
            } else if (msg_str === 'clear_slideshow_timer') {
                await s_background.BackgroundChange.i().clear_slideshow_timer();
            } else if (msg_str === 'open_theme_background') {
                s_browser_theme.LinkToImage.i().open();
            } else if (msg_str === 'get_theme_background_response') {
                return s_browser_theme.Main.i().get_theme_background_response();
            } else if (msg_str === 'get_id_of_currently_added_theme') {
                return s_browser_theme.Main.i().get_id_of_currently_added_theme();
            } else if (msg_str === 'open_background_preview') {
                s_backgrounds.Preview.i().open({ background_id: msg.background_id });
            } else if (msg_str === 'get_all_exts') {
                return s_management.Main.i().get_all_exts();
            } else if (msg_str === 'schedule_background_display') {
                await s_scheduler.Main.i().schedule_background_display();
            } else if (msg_str === 'open_default_new_tab_page') {
                await s_home_btn.Main.i().open_default_new_tab_page();
            } else {
                await x.delay(10000);
            }

            return true;
        }, 'cnt_1013'),
);
