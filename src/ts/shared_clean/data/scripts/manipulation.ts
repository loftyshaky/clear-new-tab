import cloneDeep from 'lodash/cloneDeep';

import {
    o_schema,
    s_data as s_data_loftyshaky_shared_clean,
    d_schema,
    s_service_worker,
} from '@loftyshaky/shared/shared_clean';
import { s_background, s_data, i_data } from 'shared_clean/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public service_worker_woken_up_by_update_settings_background_msg: boolean = false; // needed to prevent overwriting current_background_id by current value in set_from_storage function when uploading background while background service worker inactive

    public update_settings = ({
        settings,
        replace = false,
        transform = false,
        transform_force = false,
        load_settings = false,
        restore_back_up = false,
        update_background = false,
    }: {
        settings?: i_data.Settings;
        replace?: boolean;
        transform?: boolean;
        transform_force?: boolean;
        load_settings?: boolean;
        restore_back_up?: boolean;
        update_background?: boolean;
    } = {}): Promise<void> =>
        err_async(async () => {
            const settings_2: i_data.Settings = n(settings)
                ? settings
                : (s_data.Settings.defaults as i_data.Settings);

            let settings_final: i_data.Settings = settings_2;

            if (transform) {
                settings_final = await this.transform({
                    settings: settings_final,
                    force: transform_force,
                });

                if (restore_back_up) {
                    settings_final = s_data.Settings.apply_unchanged_prefs({
                        settings: settings_final,
                    });
                }
            }

            await s_data_loftyshaky_shared_clean.Cache.set_settings({
                settings: settings_final,
            });
            await ext.storage_set(settings_final, replace);
            await ext.send_msg_resp({
                msg: 'set_current_background_data',
                current_background_id: settings_final.current_background_id,
            });
            await this.react_to_settings_change({ load_settings, restore_back_up });

            if (n(update_background) && update_background) {
                s_background.BackgroundChange.try_to_change_background({
                    allow_to_start_slideshow_timer: false,
                    force_update: true,
                });
            }
        }, 'cnt_1320');

    private react_to_settings_change = ({
        load_settings = false,
        restore_back_up = false,
    }: {
        load_settings?: boolean;
        restore_back_up?: boolean;
    } = {}): Promise<void> =>
        err_async(async () => {
            s_service_worker.ServiceWorker.make_persistent();
            await s_data_loftyshaky_shared_clean.Cache.set({
                key: 'updating_settings',
                val: false,
            });

            if (load_settings) {
                await ext.send_msg_resp({ msg: 'load_settings', restore_back_up, transform: true });
            }
        }, 'cnt_1527');

    public update_settings_debounce = x.async_debounce(
        (
            settings: i_data.Settings,
            update_background?: boolean,
            replace: boolean = false,
            transform: boolean = false,
            load_settings: boolean = true,
            transform_force: boolean = false,
        ) =>
            err_async(async () => {
                await this.update_settings({
                    settings,
                    replace,
                    update_background,
                    transform,
                    load_settings,
                    transform_force,
                });

                ext.updating_storage = false;
            }, 'cnt_1321'),
        250,
    );

    public set_from_storage = ({
        transform = false,
    }: { transform?: boolean } = {}): Promise<void> =>
        err_async(async () => {
            if (!x.prefs_are_filled() && !x.settings_are_filled()) {
                // Runs on extension install, when the settings object is empty. The settings object is first set in @loftyshaky/shared.
                await this.update_settings({
                    transform,
                });
            } else if (
                transform &&
                !this.service_worker_woken_up_by_update_settings_background_msg
            ) {
                await this.update_settings({
                    settings: data.settings,
                    transform,
                });
            }
        }, 'cnt_1322');

    public on_init_set_from_storage = (): Promise<void> =>
        err_async(async () => {
            if (!n(data.updating_settings) || !data.updating_settings) {
                await this.set_from_storage({ transform: true });
            }
        }, 'cnt_1528');

    private transform = ({
        settings,
        force = false,
    }: {
        settings: i_data.Settings;
        force?: boolean;
    }): Promise<i_data.Settings> =>
        err_async(async () => {
            const version = d_schema.Schema.get_version_legacy({ settings });

            // This function is also fired when restoring backup
            const transform_items_settings: o_schema.TransformItem[] = [
                new o_schema.TransformItem({
                    new_key: 'prefs',
                    new_val: cloneDeep(settings),
                }),
                new o_schema.TransformItem({
                    old_key: 'options_page_theme',
                }),
                new o_schema.TransformItem({
                    old_key: 'transition_duration',
                }),
                new o_schema.TransformItem({
                    old_key: 'color_help_is_visible',
                }),
                new o_schema.TransformItem({
                    old_key: 'developer_mode',
                }),
                new o_schema.TransformItem({
                    old_key: 'enable_cut_features',
                }),
                new o_schema.TransformItem({
                    old_key: 'persistent_service_worker',
                }),
                new o_schema.TransformItem({
                    old_key: 'offers_are_visible',
                }),
                new o_schema.TransformItem({
                    old_key: 'admin_section_content_is_visible',
                }),
                new o_schema.TransformItem({
                    old_key: 'colors',
                }),
                new o_schema.TransformItem({
                    old_key: 'install_help_is_visible',
                }),
                new o_schema.TransformItem({
                    old_key: 'mode',
                }),
                new o_schema.TransformItem({
                    old_key: 'color_type',
                }),
                new o_schema.TransformItem({
                    old_key: 'keep_old_theme_backgrounds',
                }),
                new o_schema.TransformItem({
                    old_key: 'current_background_id',
                }),
                new o_schema.TransformItem({
                    old_key: 'future_background_id',
                }),
                new o_schema.TransformItem({
                    old_key: 'automatically_set_last_uploaded_background_as_current',
                }),
                new o_schema.TransformItem({
                    old_key: 'background_change_interval',
                }),
                new o_schema.TransformItem({
                    old_key: 'slideshow',
                }),
                new o_schema.TransformItem({
                    old_key: 'background_change_effect',
                }),
                new o_schema.TransformItem({
                    old_key: 'shuffle_backgrounds',
                }),
                new o_schema.TransformItem({
                    old_key: 'slide_direction',
                }),
                new o_schema.TransformItem({
                    old_key: 'background_size',
                }),
                new o_schema.TransformItem({
                    old_key: 'background_position',
                }),
                new o_schema.TransformItem({
                    old_key: 'background_repeat',
                }),
                new o_schema.TransformItem({
                    old_key: 'color_of_area_around_background',
                }),
                new o_schema.TransformItem({
                    old_key: 'video_speed',
                }),
                new o_schema.TransformItem({
                    old_key: 'video_volume',
                }),
                new o_schema.TransformItem({
                    old_key: 'download_img_when_link_given',
                }),
                new o_schema.TransformItem({
                    old_key: 'home_btn_is_visible',
                }),
                new o_schema.TransformItem({
                    old_key: 'home_btn_position',
                }),
                new o_schema.TransformItem({
                    old_key: 'year',
                }),
                new o_schema.TransformItem({
                    old_key: 'day_of_the_week',
                }),
                new o_schema.TransformItem({
                    old_key: 'month',
                }),
                new o_schema.TransformItem({
                    old_key: 'day_of_the_month',
                }),
                new o_schema.TransformItem({
                    old_key: 'time',
                }),
                new o_schema.TransformItem({
                    old_key: 'background_change_time',
                }),
                new o_schema.TransformItem({
                    old_key: 'install_help_msg_is_visible',
                }),
                new o_schema.TransformItem({
                    old_key: 'id_of_last_installed_theme',
                }),
                new o_schema.TransformItem({
                    old_key: 'current_random_solid_color',
                }),
                new o_schema.TransformItem({
                    old_key: 'backgrounds_per_page',
                }),
                new o_schema.TransformItem({
                    old_key: 'enable_video_repeat',
                }),
                new o_schema.TransformItem({
                    old_key: 'always_use_alarms_api_to_change_background_in_slideshow_mode',
                }),
                new o_schema.TransformItem({
                    old_key: 'show_item_developer_info_in_tooltip',
                }),
                new o_schema.TransformItem({
                    old_key: 'update_database_when_dnd_item',
                }),
                new o_schema.TransformItem({
                    old_key: 'one_backup_file_size_in_bytes',
                }),
            ];

            const updated_settings: i_data.Settings = await d_schema.Schema.transform({
                data_obj: settings,
                version,
                transform_items: transform_items_settings,
                keys_to_remove: ['upload_background', 'options_page_tab_id', 'last_version'],
                force,
            });

            const settings_transform_items: o_schema.TransformItem[] = [
                new o_schema.TransformItem({
                    new_key: 'video_speed',
                    new_val: 1,
                }),
                new o_schema.TransformItem({
                    new_key: 'enable_video_repeat',
                    new_val: false,
                }),
                new o_schema.TransformItem({
                    new_key: 'always_use_alarms_api_to_change_background_in_slideshow_mode',
                    new_val: false,
                }),
                new o_schema.TransformItem({
                    new_key: 'one_backup_file_size_in_bytes',
                    new_val: 419430400,
                }),
                new o_schema.TransformItem({
                    new_key: 'backgrounds_per_page',
                    new_val: 200,
                }),
                new o_schema.TransformItem({
                    new_key: 'admin_section_content_is_visible',
                    new_val: false,
                }),
                new o_schema.TransformItem({
                    new_key: 'developer_mode',
                    new_val: false,
                }),
                new o_schema.TransformItem({
                    new_key: 'clipboard_read_permission',
                    new_val: false,
                }),
                new o_schema.TransformItem({
                    new_key: 'paste_btn_is_visible',
                    new_val: false,
                }),
            ];

            const updated_prefs = await d_schema.Schema.transform({
                data_obj: updated_settings.prefs,
                version,
                transform_items: settings_transform_items,
                force,
            });

            updated_prefs.version = ext.get_app_version();

            settings.prefs = updated_prefs;

            await d_schema.Schema.replace({ settings });

            return settings;
        }, 'cnt_1199');
}

export const Manipulation = Class.get_instance();
