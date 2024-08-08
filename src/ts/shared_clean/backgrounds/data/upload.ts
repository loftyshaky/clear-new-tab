import { BigNumber } from 'bignumber.js';

import { t } from '@loftyshaky/shared/shared_clean';
import { s_backgrounds, s_db, s_i, i_backgrounds, i_db } from 'shared_clean/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public upload_with_browse_btn = async ({
        files,
        theme_id,
        backgrounds = [],
        backgrounds_before_delete = [],
        background_props,
        show_error_in_upload_box = true,
        update_current_background_id = true,
        merge_backgrounds,
        set_background_as_current,
        set_last_uploaded_background_as_current,
        set_progress_max,
        increment_progress,
        show_protecting_screen,
        hide_protecting_screen,
        allow_animation,
        forbid_animation,
        upload_success,
        upload_error,
    }: {
        files: File[] | string[];
        theme_id?: string;
        backgrounds?: i_db.Background[];
        backgrounds_before_delete?: i_db.Background[];
        background_props?: i_db.BackgroundProps;
        show_error_in_upload_box?: boolean;
        update_current_background_id?: boolean;
        merge_backgrounds?: t.CallbackVariadicAny;
        set_background_as_current?: t.CallbackVariadicVoid;
        set_last_uploaded_background_as_current?: t.CallbackVariadicVoid;
        set_progress_max?: t.CallbackVariadicVoid;
        increment_progress?: t.CallbackVariadicVoid;
        show_protecting_screen?: t.CallbackVariadicVoid;
        hide_protecting_screen?: t.CallbackVoid;
        allow_animation?: t.CallbackVoid;
        forbid_animation?: t.CallbackVoid;
        upload_success?: t.CallbackVoid;
        upload_error?: t.CallbackVariadicVoid;
    }): Promise<i_db.Background[] | undefined> => {
        let new_backgrounds_final: i_db.Background[] = [];

        try {
            const enable_progress: boolean = files.length > 1;

            if (page === 'background') {
                await ext.send_msg_resp({
                    msg: 'show_protecting_screen',
                    enable_progress,
                });
            } else if (n(show_protecting_screen)) {
                show_protecting_screen({ enable_progress });
            }

            const last_i: string = s_i.I.get_last_i({
                items:
                    backgrounds_before_delete.length === 0
                        ? backgrounds
                        : backgrounds_before_delete,
            });
            const ordered_thumbnails: i_backgrounds.OrderedThumbnails[] = [];
            const ordered_files: i_backgrounds.OrderedFiles[] = [];
            const no_backgrounds_before_upload: boolean = backgrounds.length === 0;

            if (page === 'settings' && n(set_progress_max)) {
                set_progress_max({
                    progress_max: files.length * 2,
                });
            }

            const new_backgrounds: (i_db.Background | undefined)[] = [];
            let file_i: number = 0;

            // eslint-disable-next-line no-restricted-syntax
            for await (const file of files) {
                try {
                    file_i += 1;

                    const id: string = x.unique_id();
                    const i: string = new BigNumber(last_i).plus(file_i).toString();
                    const file_type: i_backgrounds.FileType = s_backgrounds.FileType.get_file_type({
                        file,
                    });
                    const file_final: string =
                        page === 'settings' || file_type === 'img_link'
                            ? (file as string)
                            : await x.convert_blob_to_base64(file as File);

                    if (
                        s_backgrounds.FileType.is_base64({
                            file: file_final,
                        })
                    ) {
                        const file_final_split: string[] = x.chunk_str(
                            file_final,
                            x.bytes_to_base64(1048576),
                        ); // 1mb

                        // eslint-disable-next-line no-restricted-syntax
                        for await (const chunk of file_final_split) {
                            await ext.send_msg_resp({
                                msg: 'append_chunk_to_background_file_base64',
                                chunk,
                            });
                        }
                    }

                    const background_img_props: i_backgrounds.BackgroundImgProps = await (page ===
                    'settings'
                        ? s_backgrounds.Thumbnail.get_background_width_height_and_thumbnail({
                              file: file_final,
                              file_type,
                          })
                        : ext.send_msg_resp({
                              msg: 'get_background_width_height_and_thumbnail',
                              file:
                                  page === 'settings' || file_type === 'img_link'
                                      ? file_final
                                      : undefined,
                              file_type,
                          }));

                    ordered_files.push({ id, file });
                    ordered_thumbnails.push({
                        id,
                        thumbnail: background_img_props.thumbnail,
                    });

                    if (page === 'settings' && n(increment_progress)) {
                        increment_progress({
                            increment_amount: 1,
                        });
                    }

                    new_backgrounds.push({
                        id,
                        theme_id,
                        i,
                        type: `${s_backgrounds.FileType.get_file_type({
                            file,
                        })}`,
                        width: background_img_props.width,
                        height: background_img_props.height,
                        thumbnail_width: background_img_props.thumbnail_width,
                        thumbnail_height: background_img_props.thumbnail_height,
                        background_size: n(background_props) // n(background_props) - adding theme background
                            ? background_props.background_size
                            : 'global',
                        background_position: n(background_props)
                            ? background_props.background_position
                            : 'global',
                        background_repeat: n(background_props)
                            ? background_props.background_repeat
                            : 'global',
                        color_of_area_around_background: n(background_props)
                            ? background_props.color_of_area_around_background
                            : 'global',
                        video_speed: n(background_props) ? background_props.video_speed : 'global',
                        video_volume: n(background_props)
                            ? background_props.video_volume
                            : 'global',
                    });
                } catch (error_obj: any) {
                    show_err_ribbon(error_obj, 'cnt_1131', { silent: true }); // upload wrong file type (for example .txt) to cause this error
                    throw_err_obj(error_obj);

                    return undefined;
                }
            }

            const at_least_one_background_is_broken: boolean = new_backgrounds.some(
                (background: i_db.Background | undefined): boolean =>
                    err(() => !n(background), 'cnt_1133'),
            );

            // remove undefined backgrounds
            new_backgrounds_final = new_backgrounds.flatMap(
                (background: i_db.Background | undefined): i_db.Background[] =>
                    err(() => (n(background) ? [background] : []), 'cnt_1134'),
            );

            const new_background_thumbnails: i_db.BackgroundThumbnail[] = ordered_thumbnails.map(
                (ordered_thumbnail: i_backgrounds.OrderedThumbnails): i_db.BackgroundThumbnail =>
                    err(
                        () => ({
                            id: ordered_thumbnail.id,
                            background: ordered_thumbnail.thumbnail,
                        }),
                        'cnt_1135',
                    ),
            );

            const new_background_files: i_db.BackgroundFile[] = ordered_files.map(
                (ordered_file: i_backgrounds.OrderedFiles): i_db.BackgroundFile =>
                    err(
                        () => ({
                            id: ordered_file.id,
                            background: ordered_file.file,
                        }),
                        'cnt_1136',
                    ),
            );

            await s_db.Manipulation.save_backgrounds({
                backgrounds: new_backgrounds_final,
                background_thumbnails: new_background_thumbnails,
                background_files: new_background_files,
            });

            if (page === 'background') {
                await ext.send_msg_resp({ msg: 'allow_animation' });
            } else if (n(allow_animation)) {
                allow_animation();
            }

            if (page === 'settings' && n(merge_backgrounds)) {
                new_backgrounds_final = merge_backgrounds({
                    backgrounds: new_backgrounds_final,
                });
            }

            if (update_current_background_id && n(set_background_as_current)) {
                if (
                    no_backgrounds_before_upload &&
                    !data.settings.automatically_set_last_uploaded_background_as_current
                ) {
                    await set_background_as_current({
                        id: n(backgrounds[0]) ? backgrounds[0].id : 0,
                    });
                } else if (n(set_last_uploaded_background_as_current)) {
                    // eslint-disable-next-line max-len
                    await set_last_uploaded_background_as_current({
                        id: new_backgrounds_final[new_backgrounds_final.length - 1].id,
                    });
                }
            }

            if (page === 'background') {
                await ext.send_msg_resp({ msg: 'forbid_animation' });
            } else if (n(forbid_animation)) {
                forbid_animation();
            }

            if (at_least_one_background_is_broken) {
                throw_err('Upload error');
            }
        } catch (error_obj: any) {
            if (page === 'background') {
                await ext.send_msg_resp({ msg: 'upload_error' });
            } else if (n(upload_error)) {
                upload_error({ show_error_in_upload_box });
            }

            show_err_ribbon(error_obj, 'cnt_1137', { silent: true }); // upload wrong file type (for example .txt) to cause this error
            throw_err_obj(error_obj); // needed for error in paste input to be shown
        }

        if (page === 'background') {
            await ext.send_msg_resp({ msg: 'upload_success' });
            await ext.send_msg_resp({ msg: 'hide_protecting_screen' });
        } else if (n(upload_success) && n(hide_protecting_screen)) {
            upload_success();
            hide_protecting_screen();
        }

        return new_backgrounds_final;
    };
}

export const Upload = Class.get_instance();
