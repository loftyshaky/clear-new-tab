import { d_backgrounds, s_background, s_data, i_data } from 'shared/internal';

export class BackgroundChange {
    private static i0: BackgroundChange;

    public static i(): BackgroundChange {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    private force_update = false;
    public rerun: boolean = false;

    public update_background = ({ no_tr }: { no_tr: boolean }): Promise<void> =>
        err_async(async () => {
            await ext.send_msg_resp({
                msg: 'update_background',
                force_update: this.force_update,
                no_tr,
            });
        }, 'cnt_75465');

    public try_to_change_background = ({
        allow_to_start_slideshow_timer = true,
        force_change = false,
        force_update = false,
    }: {
        allow_to_start_slideshow_timer?: boolean;
        force_change?: boolean;
        force_update?: boolean;
    } = {}): Promise<void> =>
        err_async(async () => {
            this.force_update = force_update;

            const settings: i_data.Settings = await ext.storage_get();

            if (settings.mode !== 'scheduled') {
                this.clear_slideshow_timer();
            }

            if (
                ['multiple_backgrounds', 'random_solid_color'].includes(settings.mode) &&
                allow_to_start_slideshow_timer
            ) {
                const current_time: number = new Date().getTime();
                const time_to_change_background: boolean =
                    (settings.mode === 'random_solid_color' &&
                        settings.current_random_solid_color === '') ||
                    current_time >
                        settings.background_change_time + settings.background_change_interval ||
                    force_change;

                const start_slideshow_timer: boolean = settings.slideshow;

                if (time_to_change_background) {
                    await this.change_background({
                        current_time,
                        no_tr: true,
                    });

                    if (start_slideshow_timer) {
                        this.schedule_background_change({ current_time });
                    }
                } else if (start_slideshow_timer) {
                    await this.update_background({ no_tr: true });
                    this.schedule_background_change({ current_time });
                } else {
                    // multiple backgrounds, slideshow off
                    await this.update_background({ no_tr: true });
                }
            } else {
                // one background; theme background
                await this.update_background({ no_tr: true });
            }
        }, 'cnt_65432');

    public change_background = ({
        current_time,
        no_tr,
    }: {
        current_time: number;
        no_tr: boolean;
    }): Promise<void> =>
        err_async(async () => {
            await this.update_background_change_time_and_future_background_id({
                current_time,
            });

            await this.update_background({ no_tr });

            ext.send_msg({
                msg: 'set_current_background_i',
            });
        }, 'cnt_75355');

    private update_background_change_time_and_future_background_id = ({
        current_time,
    }: {
        current_time: number;
    }): Promise<void> =>
        err_async(async () => {
            const settings: i_data.Settings = await ext.storage_get();

            settings.background_change_time = current_time;

            if (settings.mode === 'random_solid_color') {
                settings.current_random_solid_color =
                    await s_background.RandomSolidColor.i().generate();

                await s_data.Main.i().update_settings({
                    settings,
                });
            } else {
                settings.current_background_id = settings.future_background_id;

                await s_data.Main.i().update_settings({
                    settings,
                });

                d_backgrounds.CurrentBackground.i().set_future_background_id();
            }
        }, 'cnt_64354');

    public schedule_background_change = ({
        current_time = 0,
        rerun = false,
    }: { current_time?: number; rerun?: boolean } = {}): Promise<void> =>
        err_async(async () => {
            this.rerun = rerun;

            const settings: i_data.Settings = await ext.storage_get();

            const can_do_slideshow: boolean = await this.can_do_slideshow();

            if (can_do_slideshow) {
                this.clear_slideshow_timer();

                const background_change_interval_corrected: number =
                    current_time +
                    (settings.background_change_interval === 1
                        ? 3000
                        : settings.background_change_interval);
                const remaining_time: number =
                    settings.background_change_time -
                    current_time +
                    background_change_interval_corrected;

                await we.alarms.create('schedule_background_change', {
                    when: rerun ? background_change_interval_corrected : remaining_time,
                });
            }
        }, 'cnt_75357');

    public clear_slideshow_timer = (): Promise<void> =>
        err_async(async () => {
            await we.alarms.clearAll();
        }, 'cnt_64466');

    public can_do_slideshow = (): Promise<boolean> =>
        err_async(async () => {
            const settings: i_data.Settings = await ext.storage_get();

            return (
                ['multiple_backgrounds', 'random_solid_color'].includes(settings.mode) &&
                settings.slideshow
            );
        }, 'cnt_56457');
}
