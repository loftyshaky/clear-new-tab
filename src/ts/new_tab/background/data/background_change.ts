import { runInAction } from 'mobx';
import { s_db } from 'shared/internal';
import { d_background, s_background } from 'new_tab/internal';

export class BackgroundChange {
    private static i0: BackgroundChange;

    public static i(): BackgroundChange {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    private visited_this_new_tab_page_once: boolean = false;

    public record_new_tab_page_visit = (): void =>
        err(() => {
            this.visited_this_new_tab_page_once = !document.hidden;
        }, 'cnt_1042');

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
                    get_background,
                    get_background_position,
                    get_background_repeat,
                    get_color_of_area_around_background,
                    get_video_volume,
                    get_background_css,
                } = d_background.Main.i();

                if (typeof background[background_container_i] === 'string') {
                    URL.revokeObjectURL(background[background_container_i]);
                }

                const preview_background_id = new URL(self.location.href).searchParams.get(
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
                        d_background.Main.i().video_volume[opposite_background_container_i] =
                            get_video_volume();
                        d_background.Main.i().background_css[opposite_background_container_i] =
                            get_background_css();
                    }, 'cnt_1044'),
                );

                await s_background.Load.i().wait_to_visibility();
            }
        }, 'cnt_1045');

    public react_to_visibility_change = (): void =>
        err(() => {
            if (document.visibilityState === 'visible') {
                if (data.settings.slideshow || !this.visited_this_new_tab_page_once) {
                    ext.send_msg({ msg: 'get_background' });
                }

                this.record_new_tab_page_visit();

                d_background.VideoPlayback.i().set_play_status({ is_playing: true });
            } else if (document.visibilityState === 'hidden') {
                ext.send_msg({ msg: 'clear_slideshow_timer' });

                d_background.VideoPlayback.i().set_play_status({ is_playing: false });
            }
        }, 'cnt_1046');
}
