import { Tabs } from 'webextension-polyfill';

import { d_backgrounds, s_background, s_data, s_tabs } from 'shared_clean/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
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
            await this.clear_slideshow_timer();

            this.force_update = force_update;

            if (
                ['multiple_backgrounds', 'random_solid_color'].includes(data.settings.prefs.mode) &&
                allow_to_start_slideshow_timer
            ) {
                const current_time: number = new Date().getTime();
                const time_to_change_background: boolean =
                    (data.settings.prefs.mode === 'random_solid_color' &&
                        data.settings.prefs.current_random_solid_color === '') ||
                    current_time >
                        data.settings.prefs.background_change_time +
                            data.settings.prefs.background_change_interval ||
                    force_change;

                const start_slideshow_timer: boolean = data.settings.prefs.slideshow;

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

            await this.update_background({
                no_tr,
            });

            d_backgrounds.CurrentBackground.set_future_background_id();

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
            data.settings.prefs.background_change_time = current_time;

            if (data.settings.prefs.mode === 'random_solid_color') {
                data.settings.prefs.current_random_solid_color =
                    await s_background.RandomSolidColor.generate();

                await s_data.Manipulation.update_settings({
                    settings: data.settings,
                    load_settings: true,
                });
            } else {
                data.settings.prefs.current_background_id =
                    data.settings.prefs.future_background_id;

                await s_data.Manipulation.update_settings({
                    settings: data.settings,
                    load_settings: true,
                });
            }
        }, 'cnt_1308');

    public run_slideshow_timer = ({
        current_time = 0,
        rerun = false,
    }: {
        current_time?: number;
        rerun?: boolean;
    } = {}): Promise<void> =>
        err_async(async () => {
            const current_tab: Tabs.Tab | undefined = await ext.get_active_tab();
            const user_is_in_new_tab: boolean =
                n(current_tab) && current_tab.id === s_tabs.TabIds.last_visited_new_tab_id;

            const schedule_background_change = ({
                rerun_2 = false,
            }: { rerun_2?: boolean } = {}): Promise<void> =>
                err_async(async () => {
                    const background_change_interval_corrected: number =
                        data.settings.prefs.background_change_interval === 1
                            ? 3000
                            : data.settings.prefs.background_change_interval;
                    const remaining_time: number =
                        data.settings.prefs.background_change_time -
                        current_time +
                        background_change_interval_corrected;
                    const delay = rerun_2 ? background_change_interval_corrected : remaining_time;

                    // 60000 = 1 minute
                    if (
                        data.settings.prefs.background_change_interval >= 60000 ||
                        data.settings.prefs
                            .always_use_alarms_api_to_change_background_in_slideshow_mode
                    ) {
                        await we.alarms.create('change_slideshow_background', {
                            when: Date.now() + delay,
                        });
                    } else {
                        this.slideshow_timers.push(
                            self.setTimeout(() => {
                                err_async(async () => {
                                    await this.change_slideshow_background();
                                    await this.run_slideshow_timer({
                                        rerun: true,
                                    });
                                }, 'cnt_1309');
                            }, delay),
                        );
                    }
                }, 'cnt_1310');

            await this.clear_slideshow_timer();

            if (
                user_is_in_new_tab &&
                ['multiple_backgrounds', 'random_solid_color'].includes(data.settings.prefs.mode) &&
                data.settings.prefs.slideshow
            ) {
                await schedule_background_change({ rerun_2: rerun });
            }
        }, 'cnt_1311');

    public clear_slideshow_timer = (): Promise<void> =>
        err_async(async () => {
            await we.alarms.clear('change_slideshow_background');

            this.slideshow_timers.forEach((slideshow_timer: number): void =>
                err(() => {
                    globalThis.clearTimeout(slideshow_timer);
                }, 'cnt_1312'),
            );

            this.slideshow_timers = [];
        }, 'cnt_1313');

    public change_slideshow_background = (): Promise<void> =>
        err_async(async () => {
            if (
                ['multiple_backgrounds', 'random_solid_color'].includes(data.settings.prefs.mode) &&
                data.settings.prefs.slideshow
            ) {
                await this.change_background({
                    current_time: new Date().getTime(),
                    no_tr: false,
                });
            }
        }, 'cnt_1424');
}

export const BackgroundChange = Class.get_instance();
