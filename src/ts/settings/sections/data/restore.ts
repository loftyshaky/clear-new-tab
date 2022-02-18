import _ from 'lodash';
import { runInAction } from 'mobx';

import { t, s_theme as s_theme_shared } from '@loftyshaky/shared';
import { s_db, s_theme, i_data, i_db } from 'shared/internal';
import { d_background_settings, d_backgrounds, d_sections, i_sections } from 'settings/internal';

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

    public restore_confirm = ({ settings }: { settings?: i_data.Settings } = {}): Promise<void> =>
        err_async(async () => {
            // eslint-disable-next-line no-alert
            const confirmed_restore: boolean = self.confirm(ext.msg('restore_defaults_confirm'));

            if (confirmed_restore) {
                const settings_final: i_data.Settings = await this.set({ settings });

                await ext.send_msg_resp({
                    msg: 'update_settings',
                    settings: settings_final,
                    update_background: true,
                });
            }
        }, 'cnt_1130');

    public download_back_up = (): Promise<string> =>
        err_async(async () => {
            const background_files: i_db.BackgroundFile[] =
                await s_db.Manipulation.i().get_background_files();
            const background_thumbnails: i_db.BackgroundThumbnail[] =
                await s_db.Manipulation.i().get_background_thumbnails();

            let backgrounds: string = '';
            let is_first_background: boolean = true;
            const backup_data_leading: string = `{"settings":${JSON.stringify(
                data.settings,
            )},"backgrounds":[`;
            const backup_data_trailing: string = ']}';
            const backup_data_leading_size = new TextEncoder().encode(backup_data_leading).length;
            const backup_data_trailing_size = new TextEncoder().encode(backup_data_trailing).length;
            let backgrounds_size: number = 0;

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
                        is_first_background ? '' : ','
                    }{"data":${JSON.stringify(background)},"thumbnail":${JSON.stringify(
                        thumbnail,
                    )},"file":${JSON.stringify(file)}}`;

                    const new_chunk_size = new TextEncoder().encode(new_chunk).length;
                    backgrounds_size += new_chunk_size;

                    const v8_limit_reached =
                        backgrounds_size +
                            new_chunk_size +
                            backup_data_leading_size +
                            backup_data_trailing_size >=
                        536870888;

                    if (v8_limit_reached) {
                        break;
                    } else {
                        backgrounds += new_chunk;

                        is_first_background = false;
                    }
                }
            }

            return backup_data_leading + backgrounds + backup_data_trailing;
        }, 'cnt_63634');

    public restore_back_up = ({ data_obj }: { data_obj: t.AnyRecord }): Promise<void> =>
        err_async(async () => {
            const settings: i_data.Settings = {
                ...data_obj.settings,
                ...this.get_unchanged_settings(),
            } as i_data.Settings;

            await this.set({ settings });

            await ext.send_msg_resp({
                msg: 'update_settings',
                settings,
                update_background: true,
                update_instantly: true,
            });

            await s_db.Manipulation.i().clear_all_tables();

            this.restored_backgrounds = [];
            this.restored_background_thumbnails = [];
            const restored_background_files: i_db.BackgroundFile[] = [];

            await Promise.all(
                data_obj.backgrounds.map(
                    (back_up_background: i_sections.BackUpBackground): Promise<void> =>
                        err_async(async () => {
                            this.restored_backgrounds.push(back_up_background.data);

                            if (
                                back_up_background.data.type.includes('color') ||
                                back_up_background.data.type === 'img_link'
                            ) {
                                this.restored_background_thumbnails.push({
                                    id: back_up_background.data.id,
                                    background: back_up_background.thumbnail.background,
                                });
                                restored_background_files.push({
                                    id: back_up_background.data.id,
                                    background: back_up_background.file.background,
                                });
                            } else if (n(back_up_background.file.name)) {
                                const blob = await x.convert_base64_to_blob(
                                    back_up_background.file.background,
                                );

                                const file: File = new File([blob], back_up_background.file.name, {
                                    type: back_up_background.file.type,
                                    lastModified: back_up_background.file.last_modified,
                                });

                                this.restored_background_thumbnails.push({
                                    id: back_up_background.data.id,
                                    background: back_up_background.thumbnail.background,
                                });

                                restored_background_files.push({
                                    id: back_up_background.data.id,
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

            d_backgrounds.BackgroundDeletion.i().deletion_reason = 'restore_back_up';

            runInAction(() =>
                err(() => {
                    d_sections.SectionContent.i().backgrounds_section_content_is_visible = false;
                }, 'cnt_94257'),
            );
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

                        s_theme_shared.Main.i().set({
                            name: data.settings.options_page_theme,
                            additional_theme_callback: s_theme.Main.i().set,
                        });
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
