import { i_db } from 'shared/internal';
import { s_backgrounds, i_backgrounds } from 'settings/internal';

export class Thumbnail {
    private static i0: Thumbnail;

    public static i(): Thumbnail {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    private canvas: HTMLCanvasElement = document.createElement('canvas');
    public min_width: number = 80;
    public max_width: number = 400;
    public height: number = 94;

    public get_background_width_height_and_thumbnail = ({
        file,
    }: {
        file: File | string;
    }): Promise<i_backgrounds.BackgroundImgProps> =>
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
                            x.bind(background, 'loadedmetadata', () => {
                                (background as HTMLVideoElement).currentTime =
                                    (background as HTMLVideoElement).duration / 3;
                            });
                        }

                        x.bind(background, file_type === 'video_file' ? 'timeupdate' : 'load', () =>
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
                                'cnt_1151',
                                { silent: true },
                            ),
                        );

                        x.bind(background, 'error', () =>
                            err(
                                () => {
                                    reject(err_obj('Upload error'));
                                },
                                'cnt_1152',
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
                'cnt_1153',
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

                if (width < this.min_width) {
                    width_final = this.min_width;
                } else if (width > this.max_width) {
                    width_final = this.max_width;
                } else {
                    width_final = width;
                }

                return {
                    width: width_final,
                    height: Math.floor(natural_height * ratio),
                };
            },
            'cnt_1154',
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
            'cnt_1155',
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
            'cnt_1156',
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
            'cnt_1157',
            { silent: true },
        );

    public get_background_thumbnail_width = ({
        background,
    }: {
        background: i_db.Background;
    }): number =>
        err(
            () =>
                background.type.includes('color')
                    ? s_backgrounds.Thumbnail.i().height
                    : (background as i_db.FileBackground).thumbnail_width,
            'cnt_1158',
        );
}
