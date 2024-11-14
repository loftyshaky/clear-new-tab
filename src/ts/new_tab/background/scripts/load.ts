import { d_background, s_background } from 'new_tab/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    private load_background = (): Promise<void> =>
        new Promise((resolve, reject) => {
            err(() => {
                try {
                    const { background_container_i } = d_background.Background;
                    const background: HTMLImageElement | HTMLVideoElement =
                        s_background.Type.is_img({ background_container_i })
                            ? new globalThis.Image()
                            : document.createElement('video');

                    x.bind(
                        background,
                        s_background.Type.is_img({ background_container_i })
                            ? 'load'
                            : 'loadeddata',
                        () =>
                            err(() => {
                                resolve();
                            }, 'cnt_1062'),
                    );

                    x.bind(background, 'error', () =>
                        err(
                            () => {
                                reject(err_obj('Load error'));
                            },
                            'cnt_1063',
                            { silent: true },
                        ),
                    );

                    if (
                        s_background.Type.is_img({ background_container_i }) ||
                        s_background.Type.is_video({ background_container_i })
                    ) {
                        background.src = s_background.Type.is_img_link({
                            background_container_i,
                        })
                            ? (d_background.Background.background[background_container_i] as string)
                            : d_background.Background.background[background_container_i];
                    } else {
                        resolve();
                    }
                } catch (error_obj: any) {
                    reject(error_obj);
                }
            }, 'cnt_1064');
        });

    public wait_to_visibility = (): Promise<void> =>
        err_async(
            async () => {
                const { background_container_i } = d_background.Background;

                if (!s_background.Type.is_color({ background_container_i })) {
                    await this.load_background();
                }

                d_background.Classes.set_classes();
            },
            'cnt_1065',
            { silent: true },
        );
}

export const Load = Class.get_instance();
