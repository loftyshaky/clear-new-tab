import { t, d_settings } from '@loftyshaky/shared/shared';
import { d_backgrounds as d_backgrounds_shared } from 'shared/internal';
import {
    d_backgrounds,
    d_browser_theme,
    d_protecting_screen,
    d_scheduler,
    d_sections,
} from 'settings/internal';

we.runtime.onMessage.addListener((msg: t.Msg): any =>
    err(() => {
        const msg_str: string = msg.msg;

        if (['load_settings', 'update_settings_settings'].includes(msg_str)) {
            return d_settings.Main.i()
                .set_from_storage()
                .then(() => true)
                .catch((error_obj: any) => show_err_ribbon(error_obj, 'cnt_1492'));
        }

        if (msg_str === 'set_current_background_i') {
            return d_settings.Main.i()
                .set_from_storage()
                .then(() => {
                    d_backgrounds_shared.CurrentBackground.i().set_current_background_i({
                        backgrounds: d_backgrounds.Main.i().backgrounds,
                    });
                })
                .then(() => true)
                .catch((error_obj: any) => show_err_ribbon(error_obj, 'cnt_1493'));
        }

        if (msg_str === 'set_current_background_id_to_id_of_first_background') {
            return d_backgrounds.CurrentBackground.i()
                .set_current_background_id_to_id_of_first_background()
                .then(() => true)
                .catch((error_obj: any) => show_err_ribbon(error_obj, 'cnt_1494'));
        }

        if (msg_str === 'delete_theme_backgrounds') {
            return d_browser_theme.Main.i()
                .delete_theme_backgrounds({
                    theme_id: msg.theme_id,
                    force_theme_redownload: msg.force_theme_redownload,
                })
                .then(() => true)
                .catch((error_obj: any) => show_err_ribbon(error_obj, 'cnt_1495'));
        }

        if (msg_str === 'set_visibility_of_error_msg') {
            d_sections.Upload.i().set_visibility_of_error_msg({
                is_visible: true,
            });

            return Promise.resolve(true);
        }

        if (msg_str === 'show_protecting_screen') {
            d_protecting_screen.Visibility.i().show({
                enable_progress: msg.enable_progress ? msg.enable_progress : false,
            });

            return Promise.resolve(true);
        }
        if (msg_str === 'hide_protecting_screen') {
            d_protecting_screen.Visibility.i().hide();

            return Promise.resolve(true);
        }

        if (msg_str === 'allow_animation') {
            d_backgrounds.BackgroundAnimation.i().allow_animation();

            return Promise.resolve(true);
        }

        if (msg_str === 'forbid_animation') {
            d_backgrounds.BackgroundAnimation.i().forbid_animation();

            return Promise.resolve(true);
        }

        if (msg_str === 'upload_success') {
            return d_backgrounds.SideEffects.i()
                .upload_success()
                .then(() => true)
                .catch((error_obj: any) => show_err_ribbon(error_obj, 'cnt_1496'));
        }

        if (msg_str === 'upload_error') {
            return d_backgrounds.SideEffects.i()
                .upload_error({
                    show_error_in_upload_box: msg.show_error_in_upload_box,
                })
                .then(() => true)
                .catch((error_obj: any) => show_err_ribbon(error_obj, 'cnt_1497'));
        }

        if (msg_str === 'update_tasks') {
            return d_scheduler.Tasks.i()
                .set_tasks()
                .then(() => true)
                .catch((error_obj: any) => show_err_ribbon(error_obj, 'cnt_1498'));
        }

        if (msg_str === 'run_theme_background_upload_begin_side_effect') {
            d_browser_theme.SideEffects.i().theme_background_upload_begin();

            return Promise.resolve(true);
        }

        if (msg_str === 'run_theme_background_upload_success_side_effect') {
            d_browser_theme.SideEffects.i().theme_background_upload_success({
                backgrounds: msg.backgrounds,
                current_background_id: msg.current_background_id,
            });

            return Promise.resolve(true);
        }

        if (msg_str === 'show_unable_to_load_background_of_local_theme_notification') {
            // eslint-disable-next-line max-len
            d_browser_theme.SideEffects.i().show_unable_to_load_background_of_local_theme_notification();

            return Promise.resolve(true);
        }

        if (msg_str === 'confirm_this_tab_is_new_tab_or_settings_page') {
            return Promise.resolve(true);
        }

        return false;
    }, 'cnt_1224'),
);
