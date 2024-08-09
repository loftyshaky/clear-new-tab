import clone from 'lodash/clone';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import { runInAction } from 'mobx';

import { t } from '@loftyshaky/shared/shared';
import { d_inputs, i_inputs } from '@loftyshaky/shared/inputs';
import { d_settings } from '@loftyshaky/shared/settings';
import { s_css_vars, s_db, i_data, i_db } from 'shared_clean/internal';
import { d_progress, s_preload_color } from 'shared/internal';
import {
    d_background_settings,
    d_backgrounds,
    d_browser_theme,
    d_pagination,
    d_protecting_screen,
    d_scheduler,
    d_sections,
    s_custom_code,
    s_theme,
    s_scrollable,
    i_sections,
} from 'settings/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public restored_backgrounds: i_db.Background[] = [];
    public restored_background_thumbnails: i_db.BackgroundThumbnail[] = [];
    public restored_tasks: i_db.Task[] = [];
    public restoring_from_back_up: boolean = false;
    public restoring_from_back_up_pagination: boolean = false;

    public restore_confirm = (): Promise<void> =>
        err_async(async () => {
            // eslint-disable-next-line no-alert
            const confirmed_restore: boolean = globalThis.confirm(
                ext.msg('restore_defaults_confirm'),
            );

            if (confirmed_restore) {
                d_protecting_screen.Visibility.show();

                const { transition_duration } = clone(data.settings);

                const settings_final: i_data.Settings = await this.set();

                await ext.send_msg_resp({
                    msg: 'update_settings_background',
                    settings: settings_final,
                    update_background: true,
                });

                await s_theme.Theme.reset({ transition_duration });
                s_css_vars.CssVars.set();
                s_preload_color.Storage.set_preload_color();
                await d_browser_theme.Backgrounds.refresh_theme_backgrounds();

                d_protecting_screen.Visibility.hide();
            }
        }, 'cnt_1270');

    public download_back_up = (): Promise<void> =>
        err_async(async () => {
            d_protecting_screen.Visibility.show({ enable_progress: true });

            const check_if_v8_limit_reached = ({
                chunks_size,
                new_chunk_size,
                chunks_2,
                new_chunk_2,
            }: {
                chunks_size: number;
                new_chunk_size: number;
                chunks_2: string;
                new_chunk_2: string;
            }): boolean =>
                err(() => {
                    try {
                        const v8_limit_reached =
                            chunks_size +
                                new_chunk_size +
                                backup_data_leading_size +
                                backup_data_trailing_size >=
                            v8_limit;

                        if (v8_limit_reached) {
                            throw_err('V8 limit reached.');
                        }

                        if (first_back_up_part_downloaded) {
                            // eslint-disable-next-line no-unused-expressions
                            backup_data_leading_chunks_only +
                                chunks_2 +
                                new_chunk_2 +
                                backup_data_trailing;
                        } else {
                            // eslint-disable-next-line no-unused-expressions
                            backup_data_leading + chunks_2 + new_chunk_2 + backup_data_trailing;
                        }

                        return false;
                    } catch (error_obj: any) {
                        show_err_ribbon(error_obj, 'cnt_1436', { silent: true });

                        return true;
                    }
                }, 'cnt_1271');

            const download_backup_part = ({ chunks_2 }: { chunks_2: string }): void =>
                err(() => {
                    d_settings.BackUp.download({
                        data_obj: first_back_up_part_downloaded
                            ? backup_data_leading_chunks_only + chunks_2 + backup_data_trailing
                            : backup_data_leading + chunks_2 + backup_data_trailing,
                        part_i,
                    });
                }, 'cnt_1409');

            const v8_limit: number = data.settings.one_backup_file_size_in_bytes;
            let v8_limit_reached: boolean = false;
            let part_i: number = 0;
            let first_back_up_part_downloaded: boolean = false;
            const custom_code: i_db.CustomCode = await s_db.Manipulation.get_custom_code();
            const background_files: i_db.BackgroundFile[] =
                await s_db.Manipulation.get_background_files();
            const background_thumbnails: i_db.BackgroundThumbnail[] =
                await s_db.Manipulation.get_background_thumbnails();

            let chunks: string = '';
            let is_first_chunk: boolean = true;
            const settings_to_store_in_file: i_data.Settings = clone(data.settings);

            settings_to_store_in_file.id_of_last_installed_theme = '';

            const backup_data_leading_chunks_only: string = '{"chunks":[';
            const backup_data_leading: string = `{"settings":${JSON.stringify(
                settings_to_store_in_file,
            )},"custom_code":${JSON.stringify(custom_code)},"chunks":[`;
            const backup_data_trailing: string = ']}';

            const backup_data_leading_size = new TextEncoder().encode(backup_data_leading).length;
            const backup_data_trailing_size = new TextEncoder().encode(backup_data_trailing).length;

            let chunks_size: number = 0;
            let background_count = 0;
            const at_least_one_background_exists =
                d_backgrounds.Backgrounds.backgrounds.length !== 0;

            if (at_least_one_background_exists) {
                d_progress.ProgressVal.set_progress_max({
                    progress_max: d_backgrounds.Backgrounds.backgrounds.length,
                });

                // eslint-disable-next-line no-restricted-syntax
                for await (const background of d_backgrounds.Backgrounds.backgrounds) {
                    background_count += 1;

                    const background_file: i_db.BackgroundFile | undefined = background_files.find(
                        (background_file_2: i_db.BackgroundFile): boolean =>
                            err(() => background_file_2.id === background.id, 'cnt_1272'),
                    );
                    const background_thumbnail: i_db.BackgroundThumbnail | undefined =
                        background_thumbnails.find(
                            (background_thumbnail_2: i_db.BackgroundFile): boolean =>
                                err(() => background_thumbnail_2.id === background.id, 'cnt_1273'),
                        );
                    const tasks: i_db.Task[] = d_scheduler.Tasks.tasks.filter(
                        (task: i_db.Task): boolean =>
                            err(() => task.background_id === background.id, 'cnt_1274'),
                    );

                    if (n(background_file) && n(background_thumbnail)) {
                        const is_color = background.type.includes('color');

                        const file: i_sections.BackUpBackgroundFile = is_color
                            ? {
                                  background: background_file.background as string,
                              }
                            : {
                                  name: (background_file.background as File).name,
                                  type: (background_file.background as File).type,
                                  last_modified: (background_file.background as File).lastModified,
                                  background:
                                      background.type === 'img_link'
                                          ? (background_file.background as string)
                                          : await x.convert_blob_to_base64(
                                                background_file.background as File,
                                            ),
                              };

                        const thumbnail: i_sections.BackUpBackgroundThumbnail = {
                            background: background_thumbnail.background,
                        };

                        const new_chunk: string = `${
                            is_first_chunk ? '' : ','
                        }{"data":${JSON.stringify(background)},"thumbnail":${JSON.stringify(
                            thumbnail,
                        )},"file":${JSON.stringify(file)},"tasks":${JSON.stringify(tasks)}}`;
                        const new_chunk_size = new TextEncoder().encode(new_chunk).length;
                        const is_last_background =
                            background_count === d_backgrounds.Backgrounds.backgrounds.length;

                        chunks_size += new_chunk_size;

                        v8_limit_reached = check_if_v8_limit_reached({
                            chunks_size,
                            new_chunk_size,
                            chunks_2: chunks,
                            new_chunk_2: new_chunk,
                        });

                        if (v8_limit_reached || is_last_background) {
                            const new_chunk_no_leading_comma: string =
                                new_chunk[0] === ',' ? new_chunk.slice(1) : new_chunk;

                            // eslint-disable-next-line max-depth
                            if (is_last_background) {
                                download_backup_part({ chunks_2: chunks + new_chunk });
                            } else {
                                download_backup_part({ chunks_2: chunks });
                            }

                            v8_limit_reached = false;
                            part_i += 1;
                            chunks = new_chunk_no_leading_comma;
                            chunks_size = 0;
                            first_back_up_part_downloaded = true;
                        } else {
                            chunks += new_chunk;

                            is_first_chunk = false;
                        }

                        if (is_last_background) {
                            d_protecting_screen.Visibility.hide();
                        }
                    }

                    d_progress.ProgressVal.increment_progress({
                        increment_amount: 1,
                    });
                }
            } else {
                download_backup_part({ chunks_2: chunks });

                d_protecting_screen.Visibility.hide();
            }
        }, 'cnt_1275');

    public restore_back_up = ({ data_objs }: { data_objs: t.AnyRecord[] }): Promise<void> =>
        err_async(async () => {
            // when backgrounds are deleted delete_all_backgrounds_transition_end_callback() fires
            d_protecting_screen.Visibility.show({ enable_progress: true });

            this.restoring_from_back_up = true;
            this.restoring_from_back_up_pagination = true;
            this.restored_backgrounds = [];
            this.restored_background_thumbnails = [];
            this.restored_tasks = [];

            const restored_background_files: i_db.BackgroundFile[] = [];

            const generate_resored_backgrounds = (): Promise<void> =>
                err_async(async () => {
                    if (n(full_data_obj)) {
                        // eslint-disable-next-line no-restricted-syntax
                        for await (const chunk of full_data_obj.chunks) {
                            this.restored_tasks = [...this.restored_tasks, ...chunk.tasks];

                            chunk.data = await d_backgrounds.Backgrounds.transform_background({
                                background: chunk.data,
                            });

                            this.restored_backgrounds.push(chunk.data);

                            if (
                                chunk.data.type.includes('color') ||
                                chunk.data.type === 'img_link'
                            ) {
                                this.restored_background_thumbnails.push({
                                    id: chunk.data.id,
                                    background: chunk.thumbnail.background,
                                });
                                restored_background_files.push({
                                    id: chunk.data.id,
                                    background: chunk.file.background,
                                });
                            } else if (n(chunk.file.name)) {
                                const blob = await x.convert_base64_to_blob(chunk.file.background);

                                const file: File = new File([blob], chunk.file.name, {
                                    type: chunk.file.type,
                                    lastModified: chunk.file.last_modified,
                                });

                                this.restored_background_thumbnails.push({
                                    id: chunk.data.id,
                                    background: chunk.thumbnail.background,
                                });

                                restored_background_files.push({
                                    id: chunk.data.id,
                                    background: file,
                                });
                            }
                            d_progress.ProgressVal.increment_progress({
                                increment_amount: 1,
                            });
                        }
                    }
                }, 'cnt_1419');

            const save_backgrounds = (): Promise<void> =>
                err_async(async () => {
                    if (one_of_the_uploaded_files_has_settings) {
                        await s_db.Manipulation.save_backgrounds({
                            backgrounds: this.restored_backgrounds,
                            background_thumbnails: this.restored_background_thumbnails,
                            background_files: restored_background_files,
                        });

                        ext.send_msg({ msg: 'schedule_background_display' });

                        d_backgrounds.BackgroundDeletion.deletion_reason = 'restore_back_up';

                        d_sections.SectionContent.set_backgrounds_section_content_visibility({
                            is_visible: false,
                        });
                    } else {
                        const missing_backgrounds: i_db.Background[] =
                            d_backgrounds.Backgrounds.get_missing_backgrounds({
                                backgrounds: this.restored_backgrounds,
                            });
                        const missing_background_thumbnails: i_db.BackgroundThumbnail[] =
                            d_backgrounds.Backgrounds.get_missing_background_thumbnails({
                                background_thumbnails: this.restored_background_thumbnails,
                            });

                        const missing_background_files: i_db.BackgroundFile[] =
                            d_backgrounds.Backgrounds.get_missing_background_files({
                                background_files: restored_background_files,
                            });

                        await s_db.Manipulation.save_backgrounds({
                            backgrounds: missing_backgrounds,
                            background_thumbnails: missing_background_thumbnails,
                            background_files: missing_background_files,
                        });

                        d_backgrounds.BackgroundAnimation.allow_animation();

                        d_backgrounds.Backgrounds.merge_backgrounds({
                            backgrounds: missing_backgrounds,
                            sort: true,
                        });

                        await s_db.Manipulation.save_tasks({
                            tasks: d_sections.Restore.restored_tasks,
                        });
                        d_scheduler.Tasks.merge_tasks({
                            tasks: d_sections.Restore.restored_tasks,
                        });

                        await d_backgrounds.BackgroundAnimation.forbid_animation();

                        await d_pagination.Page.set_last();

                        s_scrollable.Scrollable.set_scroll_position({
                            scrollable_type: 'backgrounds',
                        });
                    }
                }, 'cnt_1418');

            const data_obj_with_settings = data_objs.find((data_obj: t.AnyRecord): boolean =>
                err(() => n(data_obj.settings), 'cnt_1410'),
            );
            const one_of_the_uploaded_files_has_settings: boolean = n(data_obj_with_settings);

            const full_data_obj = one_of_the_uploaded_files_has_settings
                ? data_obj_with_settings
                : data_objs[0];

            data_objs.forEach((data_obj: t.AnyRecord): void =>
                err(() => {
                    if (
                        n(full_data_obj) &&
                        !n(data_obj.settings) &&
                        !isEqual(full_data_obj, data_obj)
                    ) {
                        full_data_obj.chunks = [...full_data_obj.chunks, ...data_obj.chunks];
                    }
                }, 'cnt_1410'),
            );

            let settings: i_data.Settings | undefined;

            if (n(full_data_obj)) {
                if (one_of_the_uploaded_files_has_settings) {
                    settings = {
                        ...full_data_obj.settings,
                        ...this.get_unchanged_settings(),
                    } as i_data.Settings;
                    settings.id_of_last_installed_theme = data.settings.id_of_last_installed_theme;

                    const { transition_duration } = clone(data.settings);

                    await this.set({ settings });

                    Object.values(
                        (d_sections.Sections.sections as any).background_settings.inputs,
                    ).forEach((input: any): void =>
                        err(() => {
                            d_inputs.NestedInput.set_parent_disbled_vals({
                                input,
                                sections: d_sections.Sections.sections as i_inputs.Sections,
                                set_to_all_sections: true,
                            });
                        }, 'cnt_1375'),
                    );

                    await ext.send_msg_resp({
                        msg: 'update_settings_background',
                        settings,
                        update_background: true,
                        update_instantly: true,
                        transform: true,
                        transform_force: true,
                    });

                    await s_theme.Theme.reset({ transition_duration });
                    s_css_vars.CssVars.set();

                    await s_db.Manipulation.reset_custom_code_table();
                    await s_db.Manipulation.clear_all_background_tables();
                    await s_db.Manipulation.clear_task_table();

                    await s_custom_code.Db.save_custom_code({
                        custom_code: full_data_obj.custom_code,
                    });
                }

                d_progress.ProgressVal.set_progress_max({
                    progress_max: full_data_obj.chunks.length * 2,
                });

                await generate_resored_backgrounds();
                await save_backgrounds();

                s_preload_color.Storage.set_preload_color();
                d_backgrounds.CurrentBackground.set_current_background_i();
                d_scheduler.Tasks.reset_background_id();

                this.restoring_from_back_up = false;

                ext.send_msg({ msg: 'get_background', force_update: true });
            }

            d_protecting_screen.Visibility.hide();
        }, 'cnt_1278');

    private set = ({ settings }: { settings?: i_data.Settings } = {}): Promise<i_data.Settings> =>
        err_async(async () => {
            let settings_final: i_data.Settings;

            if (isEmpty(settings)) {
                const default_settings = await ext.send_msg_resp({ msg: 'get_defaults' });

                settings_final = {
                    ...default_settings,
                    ...this.get_unchanged_settings(),
                };
            } else if (n(settings)) {
                settings_final = settings;
            }

            const set_inner = (): i_data.Settings => {
                runInAction(() =>
                    err(() => {
                        data.settings = settings_final;

                        d_background_settings.SettingsContext.react_to_global_selection();
                    }, 'cnt_1279'),
                );

                return settings_final;
            };

            return set_inner();
        }, 'cnt_1280');

    private get_unchanged_settings = (): t.AnyRecord =>
        err(
            () => ({
                color_help_is_visible: data.settings.color_help_is_visible,
                install_help_is_visible: data.settings.install_help_is_visible,
            }),
            'cnt_1281',
        );
}

export const Restore = Class.get_instance();
