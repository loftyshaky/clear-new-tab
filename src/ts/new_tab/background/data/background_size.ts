import merge from 'lodash/merge';
import { makeObservable, observable, action } from 'mobx';

import { i_db } from 'shared_clean/internal';
import { d_background, s_background } from 'new_tab/internal';

export class BackgroundSize {
    private static i0: BackgroundSize;

    public static i(): BackgroundSize {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    private constructor() {
        makeObservable(this, {
            background_size_setting: observable,
            background_size: observable,
            video_width: observable,
            video_height: observable,
            determine_background_size: action,
        });
    }

    public background_size_setting: string[] = merge({}, d_background.Main.i().default_val_3);
    public background_size: string[] = merge({}, d_background.Main.i().default_val_3);
    public video_width: string[] = merge({}, d_background.Main.i().default_val_3);
    public video_height: string[] = merge({}, d_background.Main.i().default_val_3);
    private screen_width: number = globalThis.screen.width;
    private screen_height: number = globalThis.screen.height;

    private get_background_size_setting = (): void =>
        err(() => {
            const { background_container_i } = d_background.Main.i();
            const background_data = d_background.Main.i().background_data[background_container_i];

            if (n(background_data)) {
                this.background_size_setting[background_container_i] =
                    (background_data as i_db.FileBackground).background_size === 'global'
                        ? data.settings.background_size
                        : (background_data as i_db.FileBackground).background_size;
            }
        }, 'cnt_1047');

    public get_background_size = (): string =>
        err(() => {
            const { background_container_i } = d_background.Main.i();

            return this.background_size_setting[background_container_i];
        }, 'cnt_1397');

    public determine_background_size = (): void =>
        err(() => {
            this.get_background_size_setting();

            const { background_container_i } = d_background.Main.i();
            const background_size_setting: string =
                this.background_size_setting[background_container_i];

            if (
                s_background.Type.i().is_img({ background_container_i }) ||
                s_background.Type.i().is_video({ background_container_i })
            ) {
                if (
                    ['dont_resize', 'fit_browser', 'cover_browser', 'stretch_browser'].includes(
                        background_size_setting,
                    )
                ) {
                    this.video_width[background_container_i] = '100%';
                    this.video_height[background_container_i] = '100%';
                }

                if (background_size_setting === 'dont_resize') {
                    this.background_size[background_container_i] = s_background.Type.i().is_img({
                        background_container_i,
                    })
                        ? 'auto auto'
                        : 'none';
                }

                if (background_size_setting === 'fit_browser') {
                    this.background_size[background_container_i] = 'contain';
                }

                if (background_size_setting === 'cover_browser') {
                    this.background_size[background_container_i] = 'cover';
                }

                if (background_size_setting === 'stretch_browser') {
                    this.background_size[background_container_i] = s_background.Type.i().is_img({
                        background_container_i,
                    })
                        ? '100% 100%'
                        : 'fill';
                }

                if (
                    ['fit_screen', 'cover_screen', 'stretch_screen'].includes(
                        background_size_setting,
                    )
                ) {
                    this.calculate_background_dims_when_in_screen_mode();
                }
            }
        }, 'cnt_1048');

    private calculate_background_dims_when_in_screen_mode = (): void =>
        err(() => {
            const browser_window_width: number = globalThis.innerWidth;
            const browser_window_height: number = globalThis.outerHeight;

            const { background_container_i } = d_background.Main.i();
            const background_size_setting: string =
                this.background_size_setting[background_container_i];
            const browser_is_in_fullscreen_mode: boolean =
                globalThis.innerWidth === this.screen_width;
            const window_size: { width: number; height: number } = {
                width: 0,
                height: 0,
            };
            let dims: { width: number; height: number } = {
                width: 0,
                height: 0,
            };

            if (browser_is_in_fullscreen_mode) {
                if (background_size_setting === 'stretch_screen') {
                    dims = {
                        width: this.screen_width,
                        height: this.screen_height,
                    };
                } else if (['fit_screen', 'cover_screen'].includes(background_size_setting)) {
                    dims = this.calculate_background_dims_when_in_fit_screen_or_cover_screen_mode({
                        window_width: this.screen_width,
                        window_height: this.screen_height,
                    });
                }

                if (background_size_setting === 'cover_screen') {
                    window_size.width = this.screen_width;
                    window_size.height = this.screen_height;
                }
            } else {
                // if browser is in windowed mode
                if (background_size_setting === 'stretch_screen') {
                    dims = {
                        width: browser_window_width,
                        height: browser_window_height,
                    };
                } else if (['fit_screen', 'cover_screen'].includes(background_size_setting)) {
                    dims = this.calculate_background_dims_when_in_fit_screen_or_cover_screen_mode({
                        window_width: browser_window_width,
                        window_height: browser_window_height,
                    });
                }

                if (background_size_setting === 'cover_screen') {
                    window_size.width = browser_window_width;
                    window_size.height = browser_window_height;
                }
            }

            if (['stretch_screen', 'fit_screen'].includes(background_size_setting)) {
                if (s_background.Type.i().is_img({ background_container_i })) {
                    this.background_size[background_container_i] = `${x.px(dims.width)} ${x.px(
                        dims.height,
                    )}`;
                } else if (s_background.Type.i().is_video({ background_container_i })) {
                    this.video_width[background_container_i] = x.px(dims.width.toString());
                    this.video_height[background_container_i] = x.px(dims.height.toString());
                }
            } else if (background_size_setting === 'cover_screen') {
                if (dims.width === window_size.width) {
                    if (s_background.Type.i().is_img({ background_container_i })) {
                        this.background_size[background_container_i] = `auto ${x.px(
                            window_size.height,
                        )}`;
                    } else if (s_background.Type.i().is_video({ background_container_i })) {
                        this.video_width[background_container_i] = 'auto';
                        this.video_height[background_container_i] = x.px(
                            window_size.height.toString(),
                        );
                    }
                } else if (dims.height === window_size.height) {
                    if (s_background.Type.i().is_img({ background_container_i })) {
                        this.background_size[background_container_i] = `${x.px(
                            window_size.width,
                        )} auto`;
                    } else if (s_background.Type.i().is_video({ background_container_i })) {
                        this.video_width[background_container_i] = x.px(
                            window_size.width.toString(),
                        );
                        this.video_height[background_container_i] = 'auto';
                    }
                }
            }

            if (s_background.Type.i().is_video({ background_container_i })) {
                this.background_size[background_container_i] = 'unset';
            }
        }, 'cnt_1049');

    private calculate_background_dims_when_in_fit_screen_or_cover_screen_mode = ({
        window_width,
        window_height,
    }: {
        window_width: number;
        window_height: number;
    }): { width: number; height: number } =>
        err(() => {
            const { background_container_i } = d_background.Main.i();

            const background_width = (
                d_background.Main.i().background_data[background_container_i] as i_db.FileBackground
            ).width;
            const background_height = (
                d_background.Main.i().background_data[background_container_i] as i_db.FileBackground
            ).height;

            const aspect_ratio = Math.min(
                window_width / background_width,
                window_height / background_height,
            ); // calculate aspect ratio

            const width = Math.round(background_width * aspect_ratio);
            const height = Math.round(background_height * aspect_ratio);

            return {
                width,
                height,
            };
        }, 'cnt_1050');
}
