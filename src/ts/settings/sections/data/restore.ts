import _ from 'lodash';
import { runInAction } from 'mobx';

import { t } from '@loftyshaky/shared';
import { s_db, s_preload_color, i_data, i_db } from 'shared/internal';
import {
    d_background_settings,
    d_backgrounds,
    d_protecting_screen,
    d_scheduler,
    d_sections,
    s_custom_code,
    s_theme,
    i_sections,
} from 'settings/internal';

export class Restore {
    private static i0: Restore;

    public static i(): Restore {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public restored_backgrounds: i_db.Background[] = [];
    public restored_background_thumbnails: i_db.BackgroundThumbnail[] = [];
    public restored_tasks: i_db.Task[] = [];

    public restore_confirm = ({ settings }: { settings?: i_data.Settings } = {}): Promise<void> =>
        err_async(async () => {
            // eslint-disable-next-line no-alert
            const confirmed_restore: boolean = self.confirm(ext.msg('restore_defaults_confirm'));

            if (confirmed_restore) {
                d_protecting_screen.Visibility.i().show();

                const { transition_duration } = _.clone(data.settings);

                const settings_final: i_data.Settings = await this.set({ settings });

                await ext.send_msg_resp({
                    msg: 'update_settings_background',
                    settings: settings_final,
                    update_background: true,
                });

                await s_theme.Main.i().reset_theme({ transition_duration });
                s_preload_color.Storage.i().set_preload_color();
                d_protecting_screen.Visibility.i().hide();
            }
        }, 'cnt_1130');

    public download_back_up = (): Promise<string> =>
        err_async(async () => {
            d_protecting_screen.Visibility.i().show();

            const check_if_v8_limit_reached = ({
                chunks_size,
                new_chunk_size,
            }: {
                chunks_size: number;
                new_chunk_size: number;
            }): boolean =>
                err(
                    () =>
                        chunks_size +
                            new_chunk_size +
                            backup_data_leading_size +
                            backup_data_trailing_size >=
                        v8_limit,
                    'cnt_86465',
                );

            const v8_limit: number = 536870888;
            let v8_limit_reached: boolean = false;
            const custom_code: i_db.CustomCode = await s_db.Manipulation.i().get_custom_code();
            const background_files: i_db.BackgroundFile[] =
                await s_db.Manipulation.i().get_background_files();
            const background_thumbnails: i_db.BackgroundThumbnail[] =
                await s_db.Manipulation.i().get_background_thumbnails();

            let chunks: string = '';
            let is_first_chunk: boolean = true;

            const backup_data_leading: string = `{"settings":${JSON.stringify(
                data.settings,
            )},"custom_code":${JSON.stringify(custom_code)},"chunks":[`;
            const backup_data_trailing: string = ']}';

            const backup_data_leading_size = new TextEncoder().encode(backup_data_leading).length;
            const backup_data_trailing_size = new TextEncoder().encode(backup_data_trailing).length;

            let chunks_size: number = 0;

            // eslint-disable-next-line no-restricted-syntax
            for await (const background of d_backgrounds.Main.i().backgrounds) {
                const background_file: i_db.BackgroundFile | undefined = background_files.find(
                    (background_file_2: i_db.BackgroundFile): boolean =>
                        err(() => background_file_2.id === background.id, 'cnt_64675'),
                );
                const background_thumbnail: i_db.BackgroundThumbnail | undefined =
                    background_thumbnails.find(
                        (background_thumbnail_2: i_db.BackgroundFile): boolean =>
                            err(() => background_thumbnail_2.id === background.id, 'cnt_64675'),
                    );
                const tasks: i_db.Task[] = d_scheduler.Tasks.i().tasks.filter(
                    (task: i_db.Task): boolean =>
                        err(() => task.background_id === background.id, 'cnt_64357'),
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

                    const new_chunk: string = `${is_first_chunk ? '' : ','}{"data":${JSON.stringify(
                        background,
                    )},"thumbnail":${JSON.stringify(thumbnail)},"file":${JSON.stringify(
                        file,
                    )},"tasks":${JSON.stringify(tasks)}}`;

                    const new_chunk_size = new TextEncoder().encode(new_chunk).length;
                    chunks_size += new_chunk_size;

                    v8_limit_reached = check_if_v8_limit_reached({
                        chunks_size,
                        new_chunk_size,
                    });

                    if (v8_limit_reached) {
                        break;
                    } else {
                        chunks += new_chunk;

                        is_first_chunk = false;
                    }
                }
            }

            return backup_data_leading + chunks + backup_data_trailing;
        }, 'cnt_63634');

    public restore_back_up = ({ data_obj }: { data_obj: t.AnyRecord }): Promise<void> =>
        err_async(async () => {
            d_protecting_screen.Visibility.i().show();

            const settings: i_data.Settings = {
                ...data_obj.settings,
                ...this.get_unchanged_settings(),
            } as i_data.Settings;
            const { transition_duration } = _.clone(data.settings);

            await this.set({ settings });

            await ext.send_msg_resp({
                msg: 'update_settings_background',
                settings,
                update_background: true,
                update_instantly: true,
            });

            await s_theme.Main.i().reset_theme({ transition_duration });

            await s_db.Manipulation.i().reset_custom_code_table();
            await s_db.Manipulation.i().clear_all_background_tables();
            await s_db.Manipulation.i().clear_task_table();

            this.restored_backgrounds = [];
            this.restored_background_thumbnails = [];
            const restored_background_files: i_db.BackgroundFile[] = [];
            this.restored_tasks = [];

            await s_custom_code.Db.i().save_custom_code({ custom_code: data_obj.custom_code });

            await Promise.all(
                data_obj.chunks.map(
                    (chunk: i_sections.BackUpChunk): Promise<void> =>
                        err_async(async () => {
                            this.restored_tasks = [...this.restored_tasks, ...chunk.tasks];

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
                        }, 'cnt_64356'),
                ),
            );

            await s_db.Manipulation.i().save_backgrounds({
                backgrounds: this.restored_backgrounds,
                background_thumbnails: this.restored_background_thumbnails,
                background_files: restored_background_files,
            });

            ext.send_msg({ msg: 'schedule_background_display' });

            d_backgrounds.BackgroundDeletion.i().deletion_reason = 'restore_back_up';

            runInAction(() =>
                err(() => {
                    d_sections.SectionContent.i().backgrounds_section_content_is_visible = false;
                }, 'cnt_94257'),
            );

            s_preload_color.Storage.i().set_preload_color();
            d_scheduler.Tasks.i().reset_background_id();
            d_protecting_screen.Visibility.i().hide();
        }, 'cnt_1131');

    private set = ({ settings }: { settings?: i_data.Settings } = {}): Promise<i_data.Settings> =>
        err_async(async () => {
            let settings_final: i_data.Settings;

            if (_.isEmpty(settings)) {
                const default_settings = await ext.send_msg_resp({ msg: 'get_defaults' });

                settings_final = { ...default_settings, ...this.get_unchanged_settings() };
            } else if (n(settings)) {
                settings_final = settings;
            }

            const set_inner = (): i_data.Settings => {
                runInAction(() =>
                    err(() => {
                        data.settings = settings_final;

                        d_background_settings.SettingsType.i().react_to_global_selection();
                    }, 'cnt_1132'),
                );

                return settings_final;
            };

            return set_inner();
        }, 'cnt_1133');

    public get_unchanged_settings = (): t.AnyRecord =>
        err(
            () => ({
                current_background_id: data.settings.current_background_id,
                future_background_id: data.settings.future_background_id,
                color_help_is_visible: data.settings.color_help_is_visible,
            }),
            'cnt_1135',
        );
}
