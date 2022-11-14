import { makeObservable, action, runInAction } from 'mobx';

import { t } from '@loftyshaky/shared';
import { s_db, i_db } from 'shared/internal';
import { d_background, i_background, s_background } from 'new_tab/internal';

export class BackgroundChange {
    private static i0: BackgroundChange;

    public static i(): BackgroundChange {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    private constructor() {
        makeObservable(this, {
            update_background_css: action,
        });
    }

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
                d_background.Classes.i().no_tr = no_tr;

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
                } = d_background.Main.i();

                if (
                    typeof background[background_container_i] === 'string' &&
                    n(background_file[background_container_i]) &&
                    d_background.Main.i().current_object_url_background_id !==
                        (background_file[background_container_i] as i_db.BackgroundFile).id
                ) {
                    URL.revokeObjectURL(d_background.Main.i().current_object_url);
                }

                const preview_background_id = new URL(globalThis.location.href).searchParams.get(
                    'preview_background_id',
                );
                const background_id: string = n(preview_background_id)
                    ? preview_background_id
                    : data.settings.current_background_id;

                const new_background_data = await s_db.Manipulation.i().get_background({
                    id: background_id,
                });

                const new_background_file = await s_db.Manipulation.i().get_background_file({
                    id: background_id,
                });

                runInAction(() =>
                    err(() => {
                        d_background.Main.i().background_container_i =
                            opposite_background_container_i;
                        d_background.Main.i().background_data[opposite_background_container_i] =
                            new_background_data;
                        d_background.Main.i().background_file[opposite_background_container_i] =
                            data.settings.mode === 'random_solid_color'
                                ? data.settings.current_random_solid_color
                                : new_background_file;
                    }, 'cnt_1043'),
                );

                d_background.BackgroundSize.i().determine_background_size();

                const video_repeat_positions: i_background.Position[] =
                    d_background.VideoReapeat.i().calculate_video_repeat_positions();

                runInAction(() =>
                    err(() => {
                        d_background.Main.i().background[opposite_background_container_i] =
                            get_background();
                        d_background.Main.i().background_position[opposite_background_container_i] =
                            get_background_position();
                        d_background.Main.i().background_repeat[opposite_background_container_i] =
                            get_background_repeat();
                        d_background.Main.i().color_of_area_around_background[
                            opposite_background_container_i
                        ] = get_color_of_area_around_background();
                        d_background.Main.i().video_speed[opposite_background_container_i] =
                            get_video_val({ type: 'speed' });
                        d_background.Main.i().video_volume[opposite_background_container_i] =
                            get_video_val({ type: 'volume' });
                        d_background.Main.i().background_css[opposite_background_container_i] =
                            get_background_css();
                        d_background.VideoReapeat.i().video_repeat_positions[
                            opposite_background_container_i
                        ] = video_repeat_positions;
                    }, 'cnt_1044'),
                );

                await s_background.Load.i().wait_to_visibility();
            }
        }, 'cnt_1045');

    public update_background_css = (): void =>
        err(() => {
            const { get_background_css, background_container_i } = d_background.Main.i();

            d_background.BackgroundSize.i().determine_background_size();

            const background_css: t.AnyRecord = get_background_css();

            d_background.Main.i().background_css[background_container_i] = background_css;
        }, 'cnt_1371');

    public react_to_visibility_change = (): void =>
        err(() => {
            if (document.visibilityState === 'visible') {
                ext.send_msg({ msg: 'get_background' });

                d_background.VideoPlayback.i().set_play_status({ is_playing: true });
            } else if (document.visibilityState === 'hidden') {
                ext.send_msg({ msg: 'clear_slideshow_timer' });

                d_background.VideoPlayback.i().set_play_status({ is_playing: false });
            }
        }, 'cnt_1046');
}
