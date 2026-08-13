import type { ChangeEvent } from 'react';

import clone from 'lodash/clone';
import { runInAction } from 'mobx';

import type { i_inputs, o_inputs } from '@loftyshaky/shared/inputs';
import { d_inputs } from '@loftyshaky/shared/inputs';
import { d_optional_permissions, s_sections } from '@loftyshaky/shared/settings';
import type { t } from '@loftyshaky/shared/shared';
import { d_error } from '@loftyshaky/shared/shared_clean';
import type { i_error } from '@loftyshaky/shared/shared_clean';
import type { i_sections } from 'settings/internal';
import {
    d_background_settings,
    d_backgrounds,
    d_browser_theme,
    d_pagination,
    d_protecting_screen,
    d_scheduler,
    d_sections,
    s_custom_code,
    s_optional_permissions,
    s_scrollable,
    s_theme,
} from 'settings/internal';
import { d_progress, s_preload_color } from 'shared/internal';
import type { i_data, i_db } from 'shared_clean/internal';
import { d_data, s_css_vars, s_data, s_db } from 'shared_clean/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {}

    public restored_backgrounds: i_db.Background[] = [];
    public restored_background_thumbnails: i_db.BackgroundThumbnail[] = [];
    public restored_tasks: i_db.Task[] = [];
    public restoring_from_back_up: boolean = false;
    public restoring_from_back_up_pagination: boolean = false;

    public restore_confirm = (): Promise<void> =>
        err_async(async () => {
            const confirmed_restore: boolean = globalThis.confirm(
                ext.msg('restore_defaults_confirm'),
            );

            if (confirmed_restore) {
                d_protecting_screen.Visibility.show();

                const { transition_duration } = clone(data.settings.prefs);
                const default_settings = await ext.send_msg_resp({
                    msg: 'get_defaults',
                });

                if (
                    n(default_settings) &&
                    typeof default_settings !== 'string' &&
                    typeof default_settings !== 'number'
                ) {
                    const default_settings_final = s_data.Settings.apply_unchanged_prefs({
                        settings: default_settings as t.AnyRecord,
                    });

                    await d_data.Manipulation.send_msg_to_update_settings({
                        settings: default_settings_final,
                        load_settings: true,
                        update_background: true,
                    });
                    d_background_settings.SettingsContext.react_to_global_selection();
                    await s_theme.Theme.reset({ transition_duration });
                    s_css_vars.CssVars.set();
                    s_preload_color.Storage.set_preload_color();
                    await d_browser_theme.Backgrounds.refresh_theme_backgrounds();

                    d_protecting_screen.Visibility.hide();
                }
            }
        }, 'cnt_1270');

    public download_back_up = (): Promise<void> =>
        err_async(async () => {
            d_protecting_screen.Visibility.show({ enable_progress: true });

            const check_if_v8_limit_reached = ({
                chunks_size,
                new_chunk_size,
            }: {
                chunks_size: number;
                new_chunk_size: number;
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

                        return false;
                    } catch (error_obj: unknown) {
                        if (n(error_obj)) {
                            show_err_ribbon(error_obj as i_error.ErrorObj, 'cnt_1436', {
                                silent: true,
                            });
                        }

                        return true;
                    }
                }, 'cnt_1271');

            const download_backup_part = ({ chunks_2 }: { chunks_2: string }): void =>
                err(() => {
                    s_sections.BackUp.download({
                        data_obj: first_back_up_part_downloaded
                            ? backup_data_leading_chunks_only + chunks_2 + backup_data_trailing
                            : backup_data_leading + chunks_2 + backup_data_trailing,
                        part_i,
                    });
                }, 'cnt_1409');

            const v8_limit: number = data.settings.prefs.one_backup_file_size_in_bytes;
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
            const prefs_to_store_in_file: i_data.Prefs = clone(data.settings.prefs);

            prefs_to_store_in_file.id_of_last_installed_theme = '';

            const backup_data_leading_chunks_only: string = '{"chunks":[';
            const backup_data_leading: string = `{"settings":{"prefs":${JSON.stringify(
                prefs_to_store_in_file,
            )}},"custom_code":${JSON.stringify(custom_code)},"chunks":[`;
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

                for (const background of d_backgrounds.Backgrounds.backgrounds) {
                    d_error.Error.print_error_code({ error_code: 'cnt_1275', loop: true });

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
                        });

                        if (v8_limit_reached || is_last_background) {
                            const new_chunk_no_leading_comma: string =
                                new_chunk[0] === ',' ? new_chunk.slice(1) : new_chunk;

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

    public restore_back_up = (
        {
            // oxlint-disable-next-line no-unused-vars
            input,
        }: {
            input: o_inputs.File;
        },
        e: ChangeEvent,
    ): Promise<void> =>
        err_async(async () => {
            const parse_file = ({ file }: { file: File }): Promise<t.AnyRecord> =>
                err_async(async () => {
                    const data_string: string = (await s_sections.BackUp.read({
                        blob: file,
                    })) as string;

                    return JSON.parse(data_string);
                }, 'cnt_1556');

            // when backgrounds are deleted delete_all_backgrounds_transition_end_callback() fires
            d_protecting_screen.Visibility.show({ enable_progress: true });

            let settings: i_data.Settings | undefined;
            const files: File[] = Array.from((e.target as HTMLInputElement).files!);

            await d_backgrounds.BackgroundDeletion.delete_all_backgrounds({
                show_protecting_screen: false,
            });

            const files_sorted = files.sort((a: File, b: File): number =>
                err(() => {
                    const a_match = a.name.match(/Part (\d+)/);
                    const b_match = b.name.match(/Part (\d+)/);

                    if (n(a_match) && b_match) {
                        return parseInt(a_match[1]) - parseInt(b_match[1]);
                    }
                    return 0;
                }, 'cnt_1555'),
            );
            const part_1_is_present = files_sorted.some((file: File): boolean =>
                err(() => file.name.includes('Part 1.json'), 'cnt_1410'),
            );

            if (part_1_is_present) {
                let chunk_count: number = 0;

                for (const file of files_sorted) {
                    d_error.Error.print_error_code({ error_code: 'cnt_1278', loop: true });

                    const data_obj = await parse_file({ file });

                    chunk_count += data_obj.chunks.length;
                }

                for (const file of files_sorted) {
                    d_error.Error.print_error_code({ error_code: 'cnt_1278', loop: true });

                    this.restoring_from_back_up = true;
                    this.restoring_from_back_up_pagination = true;
                    this.restored_backgrounds = [];
                    this.restored_background_thumbnails = [];
                    this.restored_tasks = [];

                    const is_first_part = file.name.includes('Part 1.json');
                    const back_up_file_input = s<HTMLInputElement>('.file.back_up');

                    if (n(back_up_file_input)) {
                        back_up_file_input.value = '';
                    }

                    if (file.type === 'application/json') {
                        const data_obj = await parse_file({ file });

                        if (is_first_part) {
                            settings = data_obj.settings;
                        }

                        const restored_background_files: i_db.BackgroundFile[] = [];

                        const generate_retsored_backgrounds = (): Promise<void> =>
                            err_async(async () => {
                                for await (const chunk of data_obj.chunks) {
                                    this.restored_tasks = [...this.restored_tasks, ...chunk.tasks];

                                    chunk.data =
                                        await d_backgrounds.Backgrounds.transform_background({
                                            background: chunk.data,
                                            version: '0',
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
                                        const blob = await x.convert_base64_to_blob(
                                            chunk.file.background,
                                        );

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
                            }, 'cnt_1419');

                        const save_backgrounds = (): Promise<void> =>
                            err_async(async () => {
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

                                d_pagination.Page.set_page_backgrounds();
                                await d_pagination.Page.set_last();

                                s_scrollable.Scrollable.set_scroll_position({
                                    scrollable_type: 'backgrounds',
                                });
                            }, 'cnt_1418');

                        if (is_first_part) {
                            runInAction(() =>
                                err(() => {
                                    if (n(settings)) {
                                        data.settings.prefs = settings.prefs;
                                    }
                                }, 'cnt_1560'),
                            );

                            if (n(settings)) {
                                if (settings.prefs.paste_btn_is_visible) {
                                    await d_optional_permissions.Permission.show_enable_permissions_notification(
                                        {
                                            permissions: [
                                                {
                                                    name: 'clipboardRead',
                                                    permission:
                                                        s_optional_permissions.Permissions
                                                            .optional_permission_checkbox_dict
                                                            .paste_btn_is_visible,
                                                },
                                            ],
                                        },
                                    );
                                }
                            }

                            const clipboard_read_permission: boolean =
                                s_optional_permissions.Permissions.contains_permission
                                    .paste_btn_is_visible;

                            runInAction(() =>
                                err(() => {
                                    if (n(settings)) {
                                        settings.prefs.clipboard_read_permission =
                                            clipboard_read_permission;
                                    }
                                }, 'cnt_1548'),
                            );

                            await d_data.Manipulation.send_msg_to_update_settings({
                                settings,
                                update_instantly: true,
                            });

                            d_background_settings.SettingsContext.react_to_global_selection();

                            await s_theme.Theme.reset({
                                transition_duration: n(settings)
                                    ? settings.prefs.transition_duration
                                    : 0,
                            });
                            s_css_vars.CssVars.set();

                            await s_db.Manipulation.reset_custom_code_table();
                            await s_db.Manipulation.clear_all_background_tables();
                            await s_db.Manipulation.clear_task_table();

                            await s_custom_code.Db.save_custom_code({
                                custom_code: data_obj.custom_code,
                            });
                        }

                        if (chunk_count !== 0) {
                            d_progress.ProgressVal.set_progress_max({
                                progress_max: chunk_count * 2,
                            });
                        }

                        await generate_retsored_backgrounds();
                        await save_backgrounds();
                    } else {
                        throw_err('Invalid file type');
                    }
                }

                Object.values(
                    (d_sections.Sections.sections as t.AnyRecord).background_settings.inputs,
                ).forEach((input: t.Any): void =>
                    err(() => {
                        d_inputs.NestedInput.set_parent_disbled_vals({
                            input,
                            sections: d_sections.Sections.sections as i_inputs.Sections,
                            set_to_all_sections: true,
                        });
                    }, 'cnt_1375'),
                );

                await d_data.Manipulation.send_msg_to_update_settings({
                    settings,
                    replace: true,
                    update_instantly: true,
                    transform: true,
                    transform_force: true,
                    load_settings: true,
                    restore_back_up: true,
                    update_background: true,
                });

                s_preload_color.Storage.set_preload_color();
                d_backgrounds.CurrentBackground.set_current_background_i();
                d_scheduler.Tasks.reset_background_id();

                this.restoring_from_back_up = false;

                await ext.send_msg({ msg: 'get_background', force_update: true });
            }

            d_protecting_screen.Visibility.hide();
        }, 'cnt_1278');

    public restore_back_up_react = (): Promise<void> => err_async(async () => {}, 'cnt_1549');
}

export const Restore = Class.get_instance();
