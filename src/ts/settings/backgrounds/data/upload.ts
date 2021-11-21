import _ from 'lodash';
import Pica from 'pica';

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

    private added_imgs_count: number = 0;
    private canvas: HTMLCanvasElement = document.createElement('canvas');

    public upload_with_browse_btn = async ({ files }: { files: File[] }): Promise<void> => {
        try {
            this.added_imgs_count = 0;

            const new_backgrounds: i_db.Backgrounds[] = [];

            await Promise.all(
                [...files].map(async (file: File): Promise<void> => {
                    const background_props: i_backgrounds.BackgroundProps =
                        await this.get_background_width_height_and_thumbnail({
                            file,
                        });

                    new_backgrounds.push({
                        id: x.id(),
                        background: file,
                        theme_id: undefined,
                        i: this.get_highest_background_i(),
                        type: `${s_backgrounds.FileType.i().get_file_type({
                            file,
                        })}`,
                        thumbnail: background_props.thumbnail,
                        width: background_props.width,
                        height: background_props.height,
                        background_size: 'global',
                        background_positon: 'global',
                        background_repeat: 'global',
                        color_of_area_around_background: 'global',
                        video_volume: 'global',
                    });

                    this.added_imgs_count += 1;
                }),
            );

            l(new_backgrounds);
        } catch (error_obj: any) {
            show_err_ribbon(error_obj, 'cnt_63793', { silent: true });
            throw_err_obj(error_obj);
        }
    };

    private get_highest_background_i = (): number =>
        err(
            () => {
                const background_with_highest_i = _.maxBy(d_backgrounds.Main.i().backgrounds, 'i');

                if (n(background_with_highest_i)) {
                    return background_with_highest_i.i + this.added_imgs_count + 1;
                }

                return this.added_imgs_count;
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

                        const background: HTMLImageElement | HTMLVideoElement =
                            file_type === 'img'
                                ? new window.Image()
                                : document.createElement('video');

                        if (file_type === 'video') {
                            background.addEventListener('loadedmetadata', () => {
                                (background as HTMLVideoElement).currentTime =
                                    (background as HTMLVideoElement).duration / 3;
                            });
                        }

                        background.addEventListener(
                            file_type === 'video' ? 'timeupdate' : 'load',
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

                                            if (file_type === 'img') {
                                                thumbnail = await this.create_img_thumbnail({
                                                    img: background as HTMLImageElement,
                                                    thumbnail_dims,
                                                });
                                            } else if (file_type === 'video') {
                                                thumbnail = this.create_video_thumbnail({
                                                    video: background as HTMLVideoElement,
                                                    thumbnail_dims,
                                                });
                                            }

                                            if (n(thumbnail)) {
                                                resolve({
                                                    thumbnail,
                                                    width: natural_width,
                                                    height: natural_height,
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
                            file_type === 'link'
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

                return { width: natural_width * ratio, height: natural_height * ratio };
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
    }): Promise<string> =>
        err_async(
            async () => {
                this.canvas.width = thumbnail_dims.width;
                this.canvas.height = thumbnail_dims.height;

                const thumbnail: string = await this.resize_canvas({ img });

                return thumbnail;
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
                        this.canvas.width = thumbnail_dims.width;
                        this.canvas.height = thumbnail_dims.height;

                        const context: CanvasRenderingContext2D | null =
                            this.canvas.getContext('2d');

                        if (n(context)) {
                            context.drawImage(
                                video,
                                0,
                                0,
                                thumbnail_dims.width,
                                thumbnail_dims.height,
                            );
                            const thumbnail = this.canvas.toDataURL();

                            return thumbnail;
                        }
                    }
                }

                return undefined;
            },
            'cnt_56839',
            { silent: true },
        );

    public resize_canvas = ({ img }: { img: HTMLImageElement }): Promise<string> =>
        err_async(
            async () => {
                await new Pica({ features: ['js', 'wasm'] }).resize(img, this.canvas, {
                    alpha: true,
                    unsharpAmount: 30,
                    unsharpRadius: 0.75,
                    unsharpThreshold: 1,
                });

                const resized_bese64_img: string = this.canvas.toDataURL();

                return resized_bese64_img;
            },
            'cnt_65638',
            { silent: true },
        );
}
