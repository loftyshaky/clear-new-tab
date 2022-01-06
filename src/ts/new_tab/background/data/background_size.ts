import { makeObservable, observable, action } from 'mobx';

import { i_db } from 'shared/internal';
import { d_background, s_background } from 'new_tab/internal';

export class BackgroundSize {
    private static i0: BackgroundSize;

    public static i(): BackgroundSize {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {
        makeObservable(this, {
            background_size_setting: observable,
            background_size: observable,
            video_width: observable,
            video_height: observable,
            determine_background_size: action,
        });
    }

    public background_size_setting: string = 'dont_resize';
    public background_size: string = 'auto auto';
    public video_width: string = '100%';
    public video_height: string = '100%';
    private screen_width: number = window.screen.width;
    private screen_height: number = window.screen.height;
    private browser_window_width: number = window.innerWidth;
    private browser_window_height: number = window.outerHeight;

    private get_background_size_setting = (): void =>
        err(() => {
            this.background_size_setting =
                (d_background.Main.i().current_background_data as i_db.FileBackground)
                    .background_size === 'global'
                    ? data.settings.background_size
                    : (d_background.Main.i().current_background_data as i_db.FileBackground)
                          .background_size;
        }, 'cnt_64674');

    public determine_background_size = (): void =>
        err(() => {
            this.get_background_size_setting();

            if (s_background.Type.i().is_img() || s_background.Type.i().is_video()) {
                if (
                    ['dont_resize', 'fit_browser', 'cover_browser', 'stretch_browser'].includes(
                        this.background_size_setting,
                    )
                ) {
                    this.video_width = '100%';
                    this.video_height = '100%';
                }

                if (this.background_size_setting === 'dont_resize') {
                    this.background_size = s_background.Type.i().is_img() ? 'auto auto' : 'none';
                }

                if (this.background_size_setting === 'fit_browser') {
                    this.background_size = 'contain';
                }

                if (this.background_size_setting === 'cover_browser') {
                    this.background_size = 'cover';
                }

                if (this.background_size_setting === 'stretch_browser') {
                    this.background_size = s_background.Type.i().is_img() ? '100% 100%' : 'fill';
                }

                if (
                    ['fit_screen', 'cover_screen', 'stretch_screen'].includes(
                        this.background_size_setting,
                    )
                ) {
                    this.calculate_background_dims_when_in_screen_mode();
                }
            }
        }, 'cnt_75754');

    private calculate_background_dims_when_in_screen_mode = (): void =>
        err(() => {
            const browser_is_in_fullscreen_mode: boolean = window.innerWidth === this.screen_width;
            const window_size: { width: number; height: number } = {
                width: 0,
                height: 0,
            };
            let dims: { width: number; height: number } = {
                width: 0,
                height: 0,
            };

            if (browser_is_in_fullscreen_mode) {
                if (this.background_size_setting === 'stretch_screen') {
                    dims = {
                        width: this.screen_width,
                        height: this.screen_height,
                    };
                } else if (['fit_screen', 'cover_screen'].includes(this.background_size_setting)) {
                    dims = this.calculate_background_dims_when_in_fit_screen_or_cover_screen_mode({
                        window_width: this.screen_width,
                        window_height: this.screen_height,
                    });
                }

                if (this.background_size_setting === 'cover_screen') {
                    window_size.width = this.screen_width;
                    window_size.height = this.screen_height;
                }
            } else {
                // if browser is in windowed mode
                if (this.background_size_setting === 'stretch_screen') {
                    dims = {
                        width: this.browser_window_width,
                        height: this.browser_window_height,
                    };
                } else if (['fit_screen', 'cover_screen'].includes(this.background_size_setting)) {
                    dims = this.calculate_background_dims_when_in_fit_screen_or_cover_screen_mode({
                        window_width: this.browser_window_width,
                        window_height: this.browser_window_height,
                    });
                }

                if (this.background_size_setting === 'cover_screen') {
                    window_size.width = this.browser_window_width;
                    window_size.height = this.browser_window_height;
                }
            }

            if (
                this.background_size_setting === 'stretch_screen' ||
                this.background_size_setting === 'fit_screen'
            ) {
                if (s_background.Type.i().is_img()) {
                    this.background_size = `${x.px(dims.width)} ${x.px(dims.height)}`;
                } else if (s_background.Type.i().is_video()) {
                    this.video_width = x.px(dims.width.toString());
                    this.video_height = x.px(dims.height.toString());
                }
            } else if (this.background_size_setting === 'cover_screen') {
                if (dims.width === window_size.width) {
                    if (s_background.Type.i().is_img()) {
                        this.background_size = `auto ${x.px(window_size.height)}`;
                    } else if (s_background.Type.i().is_video()) {
                        this.video_width = 'auto';
                        this.video_height = x.px(window_size.height.toString());
                    }
                } else if (dims.height === window_size.height) {
                    if (s_background.Type.i().is_img()) {
                        this.background_size = `${x.px(window_size.width)} auto`;
                    } else if (s_background.Type.i().is_video()) {
                        this.video_width = x.px(window_size.width.toString());
                        this.video_height = 'auto';
                    }
                }
            }

            if (s_background.Type.i().is_video()) {
                this.background_size = 'unset';
            }
        }, 'cnt_64635');

    private calculate_background_dims_when_in_fit_screen_or_cover_screen_mode = ({
        window_width,
        window_height,
    }: {
        window_width: number;
        window_height: number;
    }): { width: number; height: number } =>
        err(() => {
            const background_width = (
                d_background.Main.i().current_background_data as i_db.FileBackground
            ).width;
            const background_height = (
                d_background.Main.i().current_background_data as i_db.FileBackground
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
        }, 'cnt_67453');
}
