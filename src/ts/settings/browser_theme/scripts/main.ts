import { t } from '@loftyshaky/shared';
import { i_browser_theme, i_db } from 'shared/internal';
import { d_backgrounds, d_browser_theme, s_browser_theme } from 'settings/internal';

export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public try_to_get_theme_background = (): Promise<void> =>
        err_async(async () => {
            const response: i_browser_theme.GetThemeBackground | undefined =
                await ext.send_msg_resp({
                    msg: 'get_theme_background_response',
                });

            if (n(response)) {
                this.get_theme_background({
                    theme_id: response.theme_id,
                    force_theme_redownload: response.force_theme_redownload,
                });
            }
        }, 'cnt_84736');

    public get_theme_background = ({
        theme_id,
        force_theme_redownload = false,
    }: i_browser_theme.GetThemeBackground): Promise<void> =>
        err_async(async () => {
            if (data.settings.mode === 'theme_background') {
                const theme_id_final: string | undefined = n(theme_id)
                    ? theme_id
                    : await s_browser_theme.ThemeId.i().get_installed();

                if (n(theme_id_final)) {
                    await d_browser_theme.Main.i().delete_theme_background({
                        theme_id: theme_id_final,
                        force_theme_redownload,
                    });

                    const theme_background_with_this_theme_id_already_exists: boolean =
                        d_backgrounds.Main.i().backgrounds.some(
                            (background: i_db.Background): boolean =>
                                err(() => background.theme_id === theme_id_final, 'cnt_64678'),
                        );

                    if (
                        force_theme_redownload ||
                        !theme_background_with_this_theme_id_already_exists
                    ) {
                        const theme_package: ArrayBuffer = await s_browser_theme.Crx.i().get({
                            theme_id: theme_id_final,
                        });
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
                                          'cnt_65785',
                                      ),
                              )
                            : undefined;

                        if (is_valid_img_file && !is_valid_img_file && env.browser === 'firefox') {
                            throw 'Image is not valid image'; // eslint-disable-line no-throw-literal
                        }

                        const found_background_img_file_or_clear_new_tab_video_file =
                            n(theme_background_data.img_file_name) ||
                            n(theme_background_data.clear_new_tab_video_file_name);

                        if (found_background_img_file_or_clear_new_tab_video_file) {
                            const file = await s_browser_theme.ThemeFile.i().extract_file({
                                theme_package_data: theme_background_data.theme_package_data,
                                img_file_name: theme_background_data.img_file_name,
                                clear_new_tab_video_file_name:
                                    theme_background_data.clear_new_tab_video_file_name,
                            });

                            await d_backgrounds.Upload.i().upload_with_browse_btn({
                                files: [file],
                                theme_id: theme_id_final,
                                background_props: theme_background_data.background_props,
                            });
                        }
                    }
                }

                const last_theme_background: i_db.Background | undefined =
                    d_backgrounds.Main.i().backgrounds.find(
                        (background: i_db.Background): boolean =>
                            err(() => background.theme_id === theme_id_final, 'cnt_64747'),
                    );

                if (n(last_theme_background)) {
                    await d_backgrounds.CurrentBackground.i().set_background_as_current({
                        id: last_theme_background.id,
                    });
                }
            }
        }, 'cnt_75643');
}
