import { BigNumber } from 'bignumber.js';

import { o_inputs, d_inputs } from '@loftyshaky/shared/inputs';
import { s_db, i_db } from 'shared/internal';
import { d_backgrounds, s_backgrounds, i_backgrounds } from 'settings/internal';

export class Upload {
    private static i0: Upload;

    public static i(): Upload {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public upload_with_browse_btn = async ({
        files,
    }: {
        files: File[] | string[];
    }): Promise<void> => {
        try {
            const next_i: string = s_backgrounds.I.i().get_next_background_i();
            const ordered_files: i_backgrounds.OrderedFiles[] = [];

            const new_backgrounds: (i_db.Background | undefined)[] = await Promise.all(
                [...files].map(
                    async (
                        file: File | string,
                        i_2: number,
                    ): Promise<i_db.Background | undefined> =>
                        err_async(async () => {
                            try {
                                const id: string = x.unique_id();
                                const i: string = new BigNumber(next_i).plus(i_2).toString();

                                ordered_files.push({ id, file });

                                const background_props: i_backgrounds.BackgroundProps =
                                    // eslint-disable-next-line max-len
                                    await s_backgrounds.Thumbnail.i().get_background_width_height_and_thumbnail(
                                        {
                                            file,
                                        },
                                    );

                                return {
                                    id,
                                    theme_id: undefined,
                                    i,
                                    type: `${s_backgrounds.FileType.i().get_file_type({
                                        file,
                                    })}`,
                                    thumbnail: background_props.thumbnail,
                                    width: background_props.width,
                                    height: background_props.height,
                                    thumbnail_width: background_props.thumbnail_width,
                                    thumbnail_height: background_props.thumbnail_height,
                                    background_size: 'global',
                                    background_position: 'global',
                                    background_repeat: 'global',
                                    color_of_area_around_background: 'global',
                                    video_volume: 'global',
                                };
                            } catch (error_obj: any) {
                                show_err_ribbon(error_obj, 'cnt_63636', { silent: true });

                                return undefined;
                            }
                        }, 'cnt_63689'),
                ),
            );

            const at_least_one_background_is_broken: boolean = new_backgrounds.some(
                (background: i_db.Background | undefined): boolean =>
                    err(() => !n(background), 'cnt_54346'),
            );

            const new_backgrounds_final: i_db.Background[] = new_backgrounds.flatMap(
                (background: i_db.Background | undefined): i_db.Background[] =>
                    err(() => (n(background) ? [background] : []), 'cnt_54346'),
            );

            const new_background_files: i_db.BackgroundFile[] = ordered_files.map(
                (ordered_file: i_backgrounds.OrderedFiles): i_db.BackgroundFile =>
                    err(
                        () => ({
                            id: ordered_file.id,
                            background: ordered_file.file,
                        }),
                        'cnt_64285',
                    ),
            );

            await s_db.Manipulation.i().save_backgrounds({
                backgrounds: new_backgrounds_final,
                background_files: new_background_files,
            });
            d_backgrounds.BackgroundAnimation.i().allow_animation();
            d_backgrounds.Main.i().merge_backgrounds({ backgrounds: new_backgrounds_final });
            await d_backgrounds.CurrentBackground.i().set_last_uploaded_background_as_current({
                id: new_backgrounds_final[new_backgrounds_final.length - 1].id,
            });

            d_backgrounds.CurrentBackground.i().set_future_background_id();
            await d_backgrounds.BackgroundAnimation.i().forbid_animation();

            if (at_least_one_background_is_broken) {
                throw_err('Upload error');
            }
        } catch (error_obj: any) {
            show_err_ribbon(error_obj, 'cnt_63793', { silent: true });
            throw_err_obj(error_obj);
        }
    };

    public upload_with_paste_input = (
        { input }: { input: o_inputs.Text },
        e: ClipboardEvent,
    ): Promise<void> =>
        err_async(async () => {
            d_inputs.Text.i().set_loading_placeholder_text({ input });

            try {
                d_inputs.Val.i().set({
                    val: '',
                    input,
                });

                if (n(e.clipboardData)) {
                    const pasted_img_clipboard_item: DataTransferItem | undefined = [
                        ...e.clipboardData.items,
                    ].find((clipboard_item: DataTransferItem): boolean =>
                        err(() => clipboard_item.type.includes('image'), 'cnt_65210'),
                    );
                    const pasted_img_file_object: File | null = n(pasted_img_clipboard_item)
                        ? pasted_img_clipboard_item.getAsFile()
                        : null;
                    const clipboard_text: string = e.clipboardData.getData('text');
                    const input_given_text: boolean = clipboard_text !== '';

                    let img_file: File | undefined;
                    let blob_is_of_allowed_img_type: boolean = true;

                    if (
                        data.ui.allow_downloading_img_by_link &&
                        data.settings.download_img_when_link_given &&
                        input_given_text
                    ) {
                        const response: Response = await window.fetch(clipboard_text);
                        const blob: Blob = await response.blob();
                        blob_is_of_allowed_img_type = [
                            'image/gif',
                            'image/jpeg',
                            'image/jpg',
                            'image/png',
                        ].includes(blob.type);

                        if (blob_is_of_allowed_img_type) {
                            img_file = this.convert_blob_to_file_object({ blob });
                        }
                    } else {
                        img_file = n(pasted_img_file_object) ? pasted_img_file_object : undefined;
                    }

                    if (blob_is_of_allowed_img_type) {
                        await this.upload_with_browse_btn({
                            files: n(img_file) ? [img_file] : [clipboard_text],
                        });
                    }

                    d_inputs.Text.i().clear_placeholder_text({ input });
                }
            } catch (error_obj: any) {
                show_err_ribbon(error_obj, 'cnt_64379', { silent: true });

                d_inputs.Text.i().set_error_placeholder_text({ input });
            }
        }, 'cnt_56893');

    public upload_with_paste_btn = (): void =>
        err(() => {
            document.execCommand('paste');
        }, 'cnt_65286');

    private convert_blob_to_file_object = ({ blob }: { blob: Blob }): File =>
        err(
            () => new File([blob], '', { type: blob.type }), // '' is file name, it means that file object was created from blob object
            'cnt_53794',
        );
}
