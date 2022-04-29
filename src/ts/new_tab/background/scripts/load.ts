import { d_background, s_background } from 'new_tab/internal';

export class Load {
    private static i0: Load;

    public static i(): Load {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    private load_background = (): Promise<void> =>
        new Promise((resolve, reject) => {
            err(() => {
                try {
                    const { background_container_i } = d_background.Main.i();
                    const background: HTMLImageElement | HTMLVideoElement =
                        s_background.Type.i().is_img({ background_container_i })
                            ? new window.Image()
                            : document.createElement('video');

                    x.bind(
                        background,
                        s_background.Type.i().is_img({ background_container_i })
                            ? 'load'
                            : 'loadeddata',
                        () =>
                            err(() => {
                                resolve();
                            }, 'cnt_64783'),
                    );

                    x.bind(background, 'error', () =>
                        err(
                            () => {
                                reject(err_obj('Load error'));
                            },
                            'cnt_53645',
                            { silent: true },
                        ),
                    );

                    if (
                        s_background.Type.i().is_img({ background_container_i }) ||
                        s_background.Type.i().is_video({ background_container_i })
                    ) {
                        background.src = s_background.Type.i().is_img_link({
                            background_container_i,
                        })
                            ? (d_background.Main.i().background[background_container_i] as string)
                            : d_background.Main.i().background[background_container_i];
                    } else {
                        resolve();
                    }
                } catch (error_obj: any) {
                    reject(error_obj);
                }
            }, 'cnt_64356');
        });

    public wait_to_visibility = (): Promise<void> =>
        err_async(
            async () => {
                const { background_container_i } = d_background.Main.i();

                if (!s_background.Type.i().is_color({ background_container_i })) {
                    await this.load_background();
                }

                d_background.Classes.i().set_classes();
            },
            'cnt_67435',
            { silent: true },
        );
}
