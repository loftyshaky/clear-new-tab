import { d_backgrounds, s_background, s_data, i_data } from 'shared/internal';

export class BackgroundChange {
    private static i0: BackgroundChange;

    public static i(): BackgroundChange {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    private slideshow_timers: number[] = [];
    private force_update = false;

    public update_background = ({ no_tr }: { no_tr: boolean }): Promise<void> =>
        err_async(async () => {
            await ext.send_msg_resp({
                msg: 'update_background',
                force_update: this.force_update,
                no_tr,
            });
        }, 'cnt_1305');

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
            this.clear_slideshow_timer();

            this.force_update = force_update;

            const settings: i_data.Settings = await ext.storage_get();

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
                        this.run_slideshow_timer({ current_time });
                    }
                } else if (start_slideshow_timer) {
                    await this.update_background({ no_tr: true });
                    this.run_slideshow_timer({ current_time });
                } else {
                    // multiple backgrounds, slideshow off
                    await this.update_background({ no_tr: true });
                }
            } else {
                // one background; theme background
                await this.update_background({ no_tr: true });
            }
        }, 'cnt_1306');

    private change_background = ({
        current_time,
        no_tr,
    }: {
        current_time: number;
        no_tr: boolean;
    }): Promise<void> =>
        err_async(async () => {
            await this.update_background_change_time_and_current_background_id({
                current_time,
            });

            await this.update_background({ no_tr });

            d_backgrounds.CurrentBackground.i().set_future_background_id();

            ext.send_msg({
                msg: 'set_current_background_i',
            });
        }, 'cnt_1307');

    private update_background_change_time_and_current_background_id = ({
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
            }
        }, 'cnt_1308');

    public run_slideshow_timer = ({
        current_time = 0,
        rerun = false,
    }: { current_time?: number; rerun?: boolean } = {}): Promise<void> =>
        err_async(async () => {
            const settings: i_data.Settings = await ext.storage_get();

            const schedule_background_change = ({
                rerun_2 = false,
            }: { rerun_2?: boolean } = {}): Promise<void> =>
                new Promise((resolve) => {
                    err(() => {
                        const background_change_interval_corrected: number =
                            settings.background_change_interval === 1
                                ? 3000
                                : settings.background_change_interval;
                        const remaining_time: number =
                            settings.background_change_time -
                            current_time +
                            background_change_interval_corrected;

                        this.slideshow_timers.push(
                            self.setTimeout(
                                () => {
                                    err_async(async () => {
                                        if (
                                            ['multiple_backgrounds', 'random_solid_color'].includes(
                                                settings.mode,
                                            ) &&
                                            settings.slideshow
                                        ) {
                                            await this.change_background({
                                                current_time: new Date().getTime(),
                                                no_tr: false,
                                            });
                                        }

                                        resolve();
                                    }, 'cnt_1309');
                                },
                                rerun_2 ? background_change_interval_corrected : remaining_time,
                            ),
                        );
                    }, 'cnt_1310');
                });

            this.clear_slideshow_timer();

            if (
                ['multiple_backgrounds', 'random_solid_color'].includes(settings.mode) &&
                settings.slideshow
            ) {
                await schedule_background_change({ rerun_2: rerun });

                await this.run_slideshow_timer({ rerun: true });
            }
        }, 'cnt_1311');

    public clear_slideshow_timer = (): void =>
        err(() => {
            this.slideshow_timers.forEach((slideshow_timer: number): void =>
                err(() => {
                    globalThis.clearTimeout(slideshow_timer);
                }, 'cnt_1312'),
            );

            this.slideshow_timers = [];
        }, 'cnt_1313');
}
