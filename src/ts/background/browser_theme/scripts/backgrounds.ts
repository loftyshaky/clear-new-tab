import remove from 'lodash/remove';

import { t } from '@loftyshaky/shared/shared_clean';
import {
    d_backgrounds,
    d_browser_theme,
    s_data,
    s_db,
    i_browser_theme,
    i_db,
} from 'shared_clean/internal';
import { s_badge, s_browser_theme } from 'background/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public theme_id: string | undefined;
    public force_theme_redownload: boolean = false;
    public getting_theme_background: boolean = false;
    private theme_id_final: string | undefined;

    public attempt_to_run_try_to_get_theme_background = (): Promise<void> =>
        err_async(async () => {
            const already_tried_install_this_theme: boolean =
                this.theme_id === data.settings.prefs.id_of_last_installed_theme;
            const is_local_theme = await s_browser_theme.ThemeId.check_if_theme_is_local({
                theme_id: this.theme_id,
            });

            if (!is_local_theme) {
                if (
                    data.settings.prefs.mode === 'theme_background' &&
                    !already_tried_install_this_theme
                ) {
                    this.try_to_get_theme_background();
                }
            }
        }, 'cnt_1005');

    private try_to_get_theme_background = (): Promise<void> =>
        err_async(async () => {
            await this.get_theme_background({
                theme_id: this.theme_id,
                force_theme_redownload: this.force_theme_redownload,
            });
        }, 'cnt_1168');

    public get_theme_background = ({
        theme_id,
        force_theme_redownload = false,
        triggered_by_load_theme_background_btn = false,
    }: i_browser_theme.GetThemeBackground): Promise<void> =>
        err_async(async () => {
            this.force_theme_redownload = force_theme_redownload;

            this.theme_id_final = n(theme_id)
                ? theme_id
                : await s_browser_theme.ThemeId.get_installed();

            const is_local_theme = await s_browser_theme.ThemeId.check_if_theme_is_local({
                theme_id: this.theme_id_final,
            });

            if (triggered_by_load_theme_background_btn && is_local_theme) {
                await ext.send_msg_resp({
                    msg: 'show_unable_to_load_background_of_local_theme_notification',
                });
            }

            if (
                ((this.force_theme_redownload && !this.getting_theme_background) ||
                    !this.force_theme_redownload) &&
                data.settings.prefs.mode === 'theme_background'
            ) {
                this.getting_theme_background = true;

                if (n(this.theme_id_final)) {
                    if (!is_local_theme) {
                        await this.upload_from_crx({
                            force_theme_redownload,
                            triggered_by_load_theme_background_btn,
                        });
                    }
                }

                this.getting_theme_background = false;
            }
        }, 'cnt_1175');

    private delete_theme_backgrounds = ({
        backgrounds,
        force_theme_redownload,
    }: i_browser_theme.GetThemeBackgroundWithBackgrounds): Promise<i_db.Background[]> =>
        err_async(async () => {
            const ids_to_delete: string[] =
                await d_browser_theme.Backgrounds.get_ids_of_theme_backgrounds_to_delete({
                    backgrounds,
                    theme_id: this.theme_id_final,
                    force_theme_redownload,
                });

            await s_db.Manipulation.delete_backgrounds({ ids: ids_to_delete });

            const backgrounds_no_deleted: i_db.Background[] = remove(
                backgrounds,
                (background: i_db.Background) => ids_to_delete.includes(background.id),
            );

            return backgrounds_no_deleted;
        }, 'cnt_1502');

    private ensure_that_uploading_last_installed_theme_background = ({
        callback,
    }: {
        callback: t.CallbackVoid;
    }): Promise<void> =>
        err_async(
            async () => {
                if (
                    this.force_theme_redownload ||
                    !this.theme_id ||
                    this.theme_id === this.theme_id_final
                ) {
                    await callback();
                }
            },
            'cnt_1169',
            { silent: true },
        );

    private upload_from_crx = ({
        force_theme_redownload = false,
        triggered_by_load_theme_background_btn = false,
    }: i_browser_theme.GetThemeBackground): Promise<void> =>
        err_async(async () => {
            await ext.send_msg_resp({
                msg: 'run_theme_background_upload_begin_side_effect',
            });

            s_badge.Badge.set_text({ uploading_theme_background: true });

            data.settings.prefs.id_of_last_installed_theme = this.theme_id_final;

            await s_data.Manipulation.update_settings({
                settings: data.settings,
                load_settings: true,
            });

            const current_backgrounds: i_db.Background[] =
                await s_db.Manipulation.get_backgrounds();
            let new_backgrounds: i_db.Background[] | undefined = [];

            const theme_background_with_this_theme_id_already_exists: boolean =
                current_backgrounds.some((background: i_db.Background): boolean =>
                    err(() => background.theme_id === this.theme_id_final, 'cnt_1170'),
                );

            if (
                this.force_theme_redownload ||
                !theme_background_with_this_theme_id_already_exists
            ) {
                let sucessfully_got_crx: boolean = true;
                let theme_package: ArrayBuffer | undefined;

                try {
                    if (n(this.theme_id_final)) {
                        theme_package = await s_browser_theme.Crx.get({
                            theme_id: this.theme_id_final,
                        });
                    }
                } catch (error_obj: any) {
                    error_obj.exit = false;

                    show_err_ribbon(error_obj, 'cnt_1373', {
                        silent: true,
                    }); // when theme crx fetch ends with 404. To test try to fetch non-existent id

                    sucessfully_got_crx = false;
                }

                if (sucessfully_got_crx && n(theme_package)) {
                    // found_theme_package

                    const new_backgrounds_no_deleted: i_db.Background[] =
                        await this.delete_theme_backgrounds({
                            backgrounds: current_backgrounds,
                            theme_id: this.theme_id_final,
                            force_theme_redownload,
                            triggered_by_load_theme_background_btn,
                        });

                    await ext.send_msg_resp({
                        msg: 'delete_theme_backgrounds',
                        theme_id: this.theme_id_final,
                        force_theme_redownload: this.force_theme_redownload,
                    });

                    const theme_background_data: t.AnyRecord =
                        await s_browser_theme.Crx.read_manifest({
                            theme_package,
                        });
                    const is_valid_img_file: boolean | undefined = n(
                        theme_background_data.img_file_name,
                    )
                        ? s_browser_theme.ThemeFile.valid_img_file_types.some(
                              (file_ext: string): boolean =>
                                  err(
                                      () =>
                                          theme_background_data.img_file_name.endsWith(
                                              `.${file_ext}`,
                                          ),
                                      'cnt_1171',
                                  ),
                          )
                        : undefined;

                    if (is_valid_img_file && !is_valid_img_file && env.browser === 'firefox') {
                        s_badge.Badge.set_text({ uploading_theme_background: false });

                        throw 'Image is not valid image'; // eslint-disable-line no-throw-literal
                    }

                    const found_background_img_file_or_clear_new_tab_video_file =
                        n(theme_background_data.img_file_name) ||
                        n(theme_background_data.clear_new_tab_video_file_name);

                    if (found_background_img_file_or_clear_new_tab_video_file) {
                        const file = await s_browser_theme.ThemeFile.extract_file({
                            theme_package_data: theme_background_data.theme_package_data,
                            img_file_name: theme_background_data.img_file_name,
                            clear_new_tab_video_file_name:
                                theme_background_data.clear_new_tab_video_file_name,
                        });

                        await this.ensure_that_uploading_last_installed_theme_background({
                            callback: async () => {
                                new_backgrounds = await d_backgrounds.Upload.upload_with_browse_btn(
                                    {
                                        files: [file],
                                        theme_id: this.theme_id_final,
                                        backgrounds: new_backgrounds_no_deleted,
                                        backgrounds_before_delete: current_backgrounds,
                                        background_props: theme_background_data.background_props,
                                        update_current_background_id: false,
                                    },
                                );
                            },
                        });
                    } else {
                        await this.ensure_that_uploading_last_installed_theme_background({
                            callback: async () => {
                                // eslint-disable-next-line max-len
                                new_backgrounds =
                                    await d_backgrounds.Color.create_solid_color_background({
                                        color: theme_background_data.background_props
                                            .color_of_area_around_background,
                                        theme_id: this.theme_id_final,
                                        update_current_background_id: false,
                                    });
                            },
                        });
                    }
                } else {
                    await ext.send_msg_resp({ msg: 'set_visibility_of_error_msg' });
                }
            }

            const last_theme_background: i_db.Background | undefined = [
                ...current_backgrounds,
                ...new_backgrounds,
            ].find((background: i_db.Background): boolean =>
                err(() => background.theme_id === this.theme_id_final, 'cnt_1172'),
            );

            if (n(last_theme_background)) {
                await d_backgrounds.CurrentBackground.set_background_as_current({
                    id: last_theme_background.id,
                    backgrounds: new_backgrounds,
                });
            }

            await ext.send_msg_resp({
                msg: 'run_theme_background_upload_success_side_effect',
                backgrounds: new_backgrounds,
                current_background_i: n(last_theme_background) ? last_theme_background.id : 0,
            });

            s_badge.Badge.set_text({ uploading_theme_background: false });
        }, 'cnt_1374');
}

export const Backgrounds = Class.get_instance();
