import { t } from '@loftyshaky/shared';
import { i_browser_theme, i_db } from 'shared/internal';
import {
    d_backgrounds,
    d_browser_theme,
    d_protecting_screen,
    d_sections,
    s_browser_theme,
} from 'settings/internal';

export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    private getting_theme_background: boolean = false;

    public try_to_get_theme_background = (): Promise<void> =>
        err_async(async () => {
            d_protecting_screen.Visibility.i().show();

            const response: i_browser_theme.GetThemeBackground = await ext.send_msg_resp({
                msg: 'get_theme_background_response',
            });

            await this.get_theme_background({
                theme_id: response.theme_id,
                force_theme_redownload: response.force_theme_redownload,
            });

            d_protecting_screen.Visibility.i().hide();
        }, 'cnt_1168');

    public get_theme_background = ({
        theme_id,
        force_theme_redownload = false,
    }: i_browser_theme.GetThemeBackground): Promise<void> =>
        err_async(async () => {
            const get_theme_background_inner = (): Promise<void> =>
                err_async(async () => {
                    const ensure_that_uploading_last_installed_theme_background = ({
                        callback,
                    }: {
                        callback: t.CallbackVoid;
                    }): Promise<void> =>
                        err_async(
                            async () => {
                                const currently_added_theme_id: string | undefined =
                                    await ext.send_msg_resp({
                                        msg: 'get_id_of_currently_added_theme',
                                    });

                                if (
                                    force_theme_redownload ||
                                    !currently_added_theme_id ||
                                    currently_added_theme_id === theme_id_final
                                ) {
                                    await callback();
                                }
                            },
                            'cnt_1169',
                            { silent: true },
                        );
                    this.getting_theme_background = true;

                    const theme_id_final: string | undefined = n(theme_id)
                        ? theme_id
                        : await s_browser_theme.ThemeId.i().get_installed();

                    if (n(theme_id_final)) {
                        await ext.storage_set({ id_of_last_installed_theme: theme_id_final });

                        await d_browser_theme.Main.i().delete_theme_background({
                            theme_id: theme_id_final,
                            force_theme_redownload,
                        });

                        const theme_background_with_this_theme_id_already_exists: boolean =
                            d_backgrounds.Main.i().backgrounds.some(
                                (background: i_db.Background): boolean =>
                                    err(() => background.theme_id === theme_id_final, 'cnt_1170'),
                            );

                        if (
                            force_theme_redownload ||
                            !theme_background_with_this_theme_id_already_exists
                        ) {
                            const theme_package: ArrayBuffer | undefined =
                                await s_browser_theme.Crx.i().get({
                                    theme_id: theme_id_final,
                                });
                            const found_theme_package: boolean = n(theme_package);

                            if (found_theme_package) {
                                const theme_background_data: t.AnyRecord =
                                    await s_browser_theme.Crx.i().read_manifest({
                                        theme_package,
                                    });

                                const is_valid_img_file: boolean | undefined = n(
                                    theme_background_data.img_file_name,
                                )
                                    ? s_browser_theme.ThemeFile.i().valid_img_file_types.some(
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

                                if (
                                    is_valid_img_file &&
                                    !is_valid_img_file &&
                                    env.browser === 'firefox'
                                ) {
                                    throw 'Image is not valid image'; // eslint-disable-line no-throw-literal
                                }

                                const found_background_img_file_or_clear_new_tab_video_file =
                                    n(theme_background_data.img_file_name) ||
                                    n(theme_background_data.clear_new_tab_video_file_name);

                                if (found_background_img_file_or_clear_new_tab_video_file) {
                                    const file = await s_browser_theme.ThemeFile.i().extract_file({
                                        theme_package_data:
                                            theme_background_data.theme_package_data,
                                        img_file_name: theme_background_data.img_file_name,
                                        clear_new_tab_video_file_name:
                                            theme_background_data.clear_new_tab_video_file_name,
                                    });

                                    await ensure_that_uploading_last_installed_theme_background({
                                        callback: async () => {
                                            await d_backgrounds.Upload.i().upload_with_browse_btn({
                                                files: [file],
                                                theme_id: theme_id_final,
                                                background_props:
                                                    theme_background_data.background_props,
                                            });
                                        },
                                    });
                                } else {
                                    await ensure_that_uploading_last_installed_theme_background({
                                        callback: async () => {
                                            // eslint-disable-next-line max-len
                                            await d_backgrounds.Color.i().create_solid_color_background(
                                                {
                                                    color: theme_background_data.background_props
                                                        .color_of_area_around_background,
                                                    theme_id: theme_id_final,
                                                },
                                            );
                                        },
                                    });
                                }
                            } else {
                                d_sections.Upload.i().set_visibility_of_error_msg({
                                    is_visible: true,
                                });
                            }
                        }

                        const last_theme_background: i_db.Background | undefined =
                            d_backgrounds.Main.i().backgrounds.find(
                                (background: i_db.Background): boolean =>
                                    err(() => background.theme_id === theme_id_final, 'cnt_1172'),
                            );

                        if (n(last_theme_background)) {
                            await d_backgrounds.CurrentBackground.i().set_background_as_current({
                                id: last_theme_background.id,
                            });
                        }
                        this.getting_theme_background = false;
                    }
                }, 'cnt_1173');

            d_protecting_screen.Visibility.i().show();
            d_sections.Upload.i().set_visibility_of_loading_msg({ is_visible: true });
            d_sections.Upload.i().set_visibility_of_error_msg({ is_visible: false });

            try {
                if (
                    ((force_theme_redownload && !this.getting_theme_background) ||
                        !force_theme_redownload) &&
                    data.settings.mode === 'theme_background'
                ) {
                    await get_theme_background_inner();
                }
            } catch (error_obj: any) {
                d_sections.Upload.i().set_visibility_of_error_msg({ is_visible: false });
                show_err_ribbon(error_obj, 'cnt_1174', { silent: true });
            }

            d_sections.Upload.i().set_visibility_of_loading_msg({ is_visible: false });
            d_protecting_screen.Visibility.i().hide();
        }, 'cnt_1175');
}
