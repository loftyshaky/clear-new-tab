import _ from 'lodash';

import { o_inputs, d_inputs } from '@loftyshaky/shared/inputs';
import { i_db } from 'shared/internal';
import { d_backgrounds, s_backgrounds, i_backgrounds } from 'settings/internal';

export class Upload {
    private static i0: Upload;

    public static i(): Upload {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    private added_backgrounds_count: number = -1;
    private canvas: HTMLCanvasElement = document.createElement('canvas');

    public upload_with_browse_btn = async ({
        files,
    }: {
        files: File[] | string[];
    }): Promise<void> => {
        try {
            this.added_backgrounds_count = -1;

            const new_backgrounds: i_db.Background[] = await Promise.all(
                [...files].map(
                    async (file: File | string): Promise<i_db.Background> =>
                        err_async(async () => {
                            const background_props: i_backgrounds.BackgroundProps =
                                await this.get_background_width_height_and_thumbnail({
                                    file,
                                });

                            this.added_backgrounds_count += 1;

                            return {
                                theme_id: undefined,
                                i: this.get_highest_background_i(),
                                type: `${s_backgrounds.FileType.i().get_file_type({
                                    file,
                                })}`,
                                thumbnail: background_props.thumbnail,
                                width: background_props.width,
                                height: background_props.height,
                                thumbnail_width: background_props.thumbnail_width,
                                thumbnail_height: background_props.thumbnail_height,
                                background_size: 'global',
                                background_positon: 'global',
                                background_repeat: 'global',
                                color_of_area_around_background: 'global',
                                video_volume: 'global',
                            };
                        }, 'cnt_63689'),
                ),
            );

            const new_background_files: i_db.BackgroundFile[] = [...files].map(
                (file: File | string): i_db.BackgroundFile =>
                    err(
                        () => ({
                            background: file,
                        }),
                        'cnt_64285',
                    ),
            );

            d_backgrounds.Main.i().merge_backgrounds({ backgrounds: new_backgrounds });

            await s_backgrounds.Db.i().save_backgrounds({
                backgrounds: new_backgrounds,
                background_files: new_background_files,
            });
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
                        data.settings.allow_downloading_img_by_link &&
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

    private get_highest_background_i = (): number =>
        err(
            () => {
                const background_with_highest_i = _.maxBy(d_backgrounds.Main.i().backgrounds, 'i');

                if (n(background_with_highest_i)) {
                    return background_with_highest_i.i + this.added_backgrounds_count + 1;
                }

                return this.added_backgrounds_count;
            },
            'cnt_43795',
            { silent: true },
        );

    private get_background_width_height_and_thumbnail = ({
        file,
    }: {
        file: File | string;
    }): Promise<i_backgrounds.BackgroundProps> =>
        new Promise((resolve, reject) => {
            err(
                () => {
                    try {
                        const file_type: i_backgrounds.FileType =
                            s_backgrounds.FileType.i().get_file_type({
                                file,
                            });

                        const background: HTMLImageElement | HTMLVideoElement = [
                            'img_file',
                            'img_link',
                        ].includes(file_type)
                            ? new window.Image()
                            : document.createElement('video');

                        if (file_type === 'video_file') {
                            background.addEventListener('loadedmetadata', () => {
                                (background as HTMLVideoElement).currentTime =
                                    (background as HTMLVideoElement).duration / 3;
                            });
                        }

                        background.addEventListener(
                            file_type === 'video_file' ? 'timeupdate' : 'load',
                            () =>
                                err_async(
                                    async () => {
                                        try {
                                            let thumbnail: string | undefined;
                                            const natural_width: number =
                                                (background as HTMLImageElement).naturalWidth ||
                                                (background as HTMLVideoElement).videoWidth;
                                            const natural_height: number =
                                                (background as HTMLImageElement).naturalHeight ||
                                                (background as HTMLVideoElement).videoHeight;

                                            const thumbnail_dims: i_backgrounds.BackgroundDims =
                                                this.calculate_thumbnails_dims({
                                                    natural_width,
                                                    natural_height,
                                                });

                                            if (file_type === 'img_file') {
                                                thumbnail = await this.create_img_thumbnail({
                                                    img: background as HTMLImageElement,
                                                    thumbnail_dims,
                                                });
                                            } else if (file_type === 'video_file') {
                                                thumbnail = this.create_video_thumbnail({
                                                    video: background as HTMLVideoElement,
                                                    thumbnail_dims,
                                                });
                                            } else if (file_type === 'img_link') {
                                                thumbnail = file as string;
                                            }

                                            if (n(thumbnail)) {
                                                resolve({
                                                    thumbnail,
                                                    width: natural_width,
                                                    height: natural_height,
                                                    thumbnail_width: thumbnail_dims.width,
                                                    thumbnail_height: thumbnail_dims.height,
                                                });
                                            } else {
                                                reject(err_obj('Upload error'));
                                            }
                                        } catch (error_obj: any) {
                                            reject(error_obj);
                                        }
                                    },
                                    'cnt_64783',
                                    { silent: true },
                                ),
                        );

                        background.src =
                            file_type === 'img_link'
                                ? (file as string)
                                : URL.createObjectURL(file as File);
                    } catch (error_obj: any) {
                        reject(error_obj);
                    }
                },
                'cnt_42684',
                { silent: true },
            );
        });

    private calculate_thumbnails_dims = ({
        natural_width,
        natural_height,
    }: {
        natural_width: number;
        natural_height: number;
    }): i_backgrounds.BackgroundDims =>
        err(
            () => {
                const ratio = Math.min(Infinity / natural_width, 94 / natural_height);
                const width: number = Math.floor(natural_width * ratio);
                let width_final: number = 0;

                if (width < 80) {
                    width_final = 80;
                } else if (width > 400) {
                    width_final = 400;
                } else {
                    width_final = width;
                }

                return {
                    width: width_final,
                    height: Math.floor(natural_height * ratio),
                };
            },
            'cnt_63745',
            { silent: true },
        );

    private create_img_thumbnail = ({
        img,
        thumbnail_dims,
    }: {
        img: HTMLImageElement;
        thumbnail_dims: i_backgrounds.BackgroundDims;
    }): string | undefined =>
        err(
            () => {
                const thumbnail: string | undefined = this.resize_canvas({
                    background: img,
                    thumbnail_dims,
                });

                if (n(thumbnail)) {
                    return thumbnail;
                }

                return undefined;
            },
            'cnt_53709',
            { silent: true },
        );

    public create_video_thumbnail = ({
        video,
        thumbnail_dims,
    }: {
        video: HTMLVideoElement;
        thumbnail_dims: i_backgrounds.BackgroundDims;
    }): string | undefined =>
        err(
            () => {
                if (video.readyState === 4) {
                    // for firefox. When image is broken in firefox it returns naturalWidth 0
                    if (thumbnail_dims.width > 0) {
                        const thumbnail: string | undefined = this.resize_canvas({
                            background: video,
                            thumbnail_dims,
                        });

                        if (n(thumbnail)) {
                            return thumbnail;
                        }
                    }
                }

                return undefined;
            },
            'cnt_56839',
            { silent: true },
        );

    public resize_canvas = ({
        background,
        thumbnail_dims,
    }: {
        background: HTMLImageElement | HTMLVideoElement;
        thumbnail_dims: i_backgrounds.BackgroundDims;
    }): string | undefined =>
        err(
            () => {
                this.canvas.width = thumbnail_dims.width;
                this.canvas.height = thumbnail_dims.height;

                const context: CanvasRenderingContext2D | null = this.canvas.getContext('2d');

                if (n(context)) {
                    context.drawImage(
                        background,
                        0,
                        0,
                        thumbnail_dims.width,
                        thumbnail_dims.height,
                    );
                    const thumbnail = this.canvas.toDataURL();

                    return thumbnail;
                }

                return undefined;
            },
            'cnt_65638',
            { silent: true },
        );

    private convert_blob_to_file_object = ({ blob }: { blob: Blob }): File =>
        err(
            () => new File([blob], '', { type: blob.type }), // '' is file name, it means that file object was created from blob object
            'cnt_53794',
        );
}
