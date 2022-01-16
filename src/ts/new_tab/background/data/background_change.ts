import { runInAction } from 'mobx';
import { d_backgrounds, s_db, d_settings } from 'shared/internal';
import { d_background, s_background } from 'new_tab/internal';

export class BackgroundChange {
    private static i0: BackgroundChange;

    public static i(): BackgroundChange {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public try_to_change_background = (): Promise<void> =>
        err_async(async () => {
            if (data.settings.mode === 'multiple_backgrounds') {
                const current_time: number = new Date().getTime();
                const time_to_change_background: boolean =
                    current_time >
                    data.settings.background_change_time + data.settings.background_change_interval;

                if (time_to_change_background) {
                    d_settings.Main.i().change({
                        key: 'background_change_time',
                        val: current_time,
                    });

                    data.settings.current_background_id = data.settings.future_background_id;

                    await d_backgrounds.CurrentBackground.i().set_future_background_id();

                    if (data.settings.slideshow) {
                    } else {
                        await this.update_background();
                    }
                } else {
                    await this.update_background();
                }
            } else {
                await this.update_background();
            }

            ext.send_msg({
                msg: 'update_background',
            });
            ext.send_msg({
                msg: 'set_current_background_i',
            });
        }, 'cnt_65432');

    public update_background = ({
        no_tr = false,
    }: {
        no_tr?: boolean;
    } = {}): Promise<void> =>
        err_async(async () => {
            d_background.Classes.i().no_tr = no_tr;

            const {
                opposite_background_container_i,
                background,
                get_background,
                get_background_position,
                get_background_repeat,
                get_color_of_area_around_background,
                get_video_volume,
                get_background_css,
            } = d_background.Main.i();

            if (typeof background === 'string') {
                URL.revokeObjectURL(background);
            }

            const new_background_data = await s_db.Manipulation.i().get_background({
                id: data.settings.current_background_id,
            });
            const new_background_file = await s_db.Manipulation.i().get_background_file({
                id: data.settings.current_background_id,
            });

            runInAction(() =>
                err(() => {
                    d_background.Main.i().background_container_i = opposite_background_container_i;
                    d_background.Main.i().background_data[opposite_background_container_i] =
                        new_background_data;
                    d_background.Main.i().background_file[opposite_background_container_i] =
                        new_background_file;
                }, 'cnt_74757'),
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
                }, 'cnt_84755'),
            );

            await s_background.Load.i().wait_to_visibility();
        }, 'cnt_75465');
}
