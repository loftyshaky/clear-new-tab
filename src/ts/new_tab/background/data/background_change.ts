import { makeObservable, action, runInAction } from 'mobx';

import { t } from '@loftyshaky/shared/shared';
import { s_db, i_db } from 'shared_clean/internal';
import { d_background, s_background, i_background } from 'new_tab/internal';
import { set_preload_color } from 'new_tab/preload_color';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {
        makeObservable(this, {
            update_background_css: action,
        });
    }

    private previous_browser_window_width: number = 0;
    private previous_browser_window_height: number = 0;

    public update_background = ({
        no_tr = false,
        force_update = false,
    }: {
        no_tr?: boolean;
        force_update?: boolean;
    } = {}): Promise<void> =>
        err_async(async () => {
            if (
                (!data.settings.slideshow && !document.hidden) ||
                data.settings.slideshow ||
                force_update
            ) {
                d_background.Classes.no_tr = no_tr;

                const {
                    background_container_i,
                    opposite_background_container_i,
                    background,
                    background_file,
                    get_background,
                    get_background_position,
                    get_background_repeat,
                    get_color_of_area_around_background,
                    get_video_val,
                    get_background_css,
                } = d_background.Background;

                if (
                    typeof background[background_container_i] === 'string' &&
                    n(background_file[background_container_i]) &&
                    d_background.Background.current_object_url_background_id !==
                        (background_file[background_container_i] as i_db.BackgroundFile).id
                ) {
                    URL.revokeObjectURL(d_background.Background.current_object_url);
                }

                const preview_background_id = s_background.Preview.id;
                const preloaded_background_data = await ext.send_msg_resp({
                    msg: 'get_preloaded_background_data',
                    current_background_id: data.settings.current_background_id,
                });

                const new_background_data = n(preview_background_id)
                    ? await s_db.Manipulation.get_background({
                          id: preview_background_id,
                      })
                    : preloaded_background_data.current_background;
                const new_background_file = n(preview_background_id)
                    ? await s_db.Manipulation.get_background_file({
                          id: preview_background_id,
                      })
                    : preloaded_background_data.current_background_file;

                runInAction(() =>
                    err(() => {
                        d_background.Background.background_container_i =
                            opposite_background_container_i;
                        d_background.Background.background_data[opposite_background_container_i] =
                            new_background_data;
                        d_background.Background.background_file[opposite_background_container_i] =
                            data.settings.mode === 'random_solid_color'
                                ? data.settings.current_random_solid_color
                                : new_background_file;
                    }, 'cnt_1043'),
                );

                d_background.BackgroundSize.determine_background_size();

                const video_repeat_positions: i_background.Position[] =
                    d_background.VideoReapeat.calculate_video_repeat_positions();

                runInAction(() =>
                    err(() => {
                        d_background.Background.background[opposite_background_container_i] =
                            get_background();
                        d_background.Background.background_position[
                            opposite_background_container_i
                        ] = get_background_position();
                        d_background.Background.background_repeat[opposite_background_container_i] =
                            get_background_repeat();
                        d_background.Background.color_of_area_around_background[
                            opposite_background_container_i
                        ] = get_color_of_area_around_background();
                        d_background.Background.video_speed[opposite_background_container_i] =
                            get_video_val({ type: 'speed' });
                        d_background.Background.video_volume[opposite_background_container_i] =
                            get_video_val({ type: 'volume' });
                        d_background.Background.background_css[opposite_background_container_i] =
                            get_background_css();
                        d_background.VideoReapeat.video_repeat_positions[
                            opposite_background_container_i
                        ] = video_repeat_positions;
                    }, 'cnt_1044'),
                );

                set_preload_color();

                await s_background.Load.wait_to_visibility();
            }
        }, 'cnt_1045');

    public update_background_css = (): void =>
        err(() => {
            const { get_background_css, background_container_i } = d_background.Background;

            d_background.BackgroundSize.determine_background_size();

            const background_css: t.AnyRecord = get_background_css();

            d_background.Background.background_css[background_container_i] = background_css;
        }, 'cnt_1371');

    public react_to_visibility_change = (): void =>
        err(() => {
            const browser_window_width: number = globalThis.innerWidth;
            const browser_window_height: number = globalThis.outerHeight;
            const window_resized =
                this.previous_browser_window_width !== browser_window_width ||
                this.previous_browser_window_height !== browser_window_height;

            if (document.visibilityState === 'visible') {
                if (data.settings.slideshow || window_resized) {
                    ext.send_msg({ msg: 'get_background', force_update: window_resized });
                }

                d_background.VideoPlayback.set_play_status({ is_playing: true });
            } else if (document.visibilityState === 'hidden') {
                ext.send_msg({ msg: 'clear_slideshow_timer' });

                d_background.VideoPlayback.set_play_status({ is_playing: false });
            }

            this.previous_browser_window_width = browser_window_width;
            this.previous_browser_window_height = browser_window_height;
        }, 'cnt_1046');
}

export const BackgroundChange = Class.get_instance();
