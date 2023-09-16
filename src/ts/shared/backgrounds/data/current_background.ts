import _ from 'lodash';
import { makeObservable, action } from 'mobx';

import { db, s_background, d_backgrounds, s_data, s_db, s_i, i_data, i_db } from 'shared/internal';

export class CurrentBackground {
    private static i0: CurrentBackground;

    public static i(): CurrentBackground {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    private constructor() {
        makeObservable<CurrentBackground, 'set_current_background_i'>(this, {
            set_current_background_i: action,
            set_background_as_current: action,
        });
    }

    public reset_val: number = 0;

    public set_current_background_i = ({
        backgrounds,
        current_background_id,
    }: {
        backgrounds: i_db.Background[];
        current_background_id?: string | number;
    }): void =>
        err(() => {
            const no_backgrounds_exist: boolean = backgrounds.length === 0;

            if (no_backgrounds_exist) {
                data.ui.current_background_i = d_backgrounds.CurrentBackground.i().reset_val;
            } else {
                const i_of_background_with_current_id: number = s_i.Main.i().find_i_of_item_with_id(
                    {
                        id: n(current_background_id)
                            ? current_background_id
                            : data.settings.current_background_id,
                        items: backgrounds,
                    },
                );

                data.ui.current_background_i = i_of_background_with_current_id + 1;
            }
        }, 'cnt_1111');

    public set_background_as_current = ({
        id,
        backgrounds,
    }: {
        id: string | number | undefined;
        backgrounds: i_db.Background[];
    }): Promise<void> =>
        err_async(async () => {
            const settings: i_data.Settings = await ext.storage_get();

            if (n(id)) {
                settings.current_background_id = id;

                this.set_current_background_i({ backgrounds, current_background_id: id });

                if (id === 0) {
                    data.settings.future_background_id = id;
                }

                data.settings.background_change_time = new Date().getTime();

                if (page === 'background') {
                    await s_data.Main.i().update_settings({
                        settings,
                    });
                } else if (page === 'settings') {
                    await ext.send_msg_resp({
                        msg: 'update_settings_background',
                        settings,
                        update_instantly: true,
                    });
                }

                this.set_future_background_id();

                if (page === 'background') {
                    s_background.BackgroundChange.i().try_to_change_background({
                        allow_to_start_slideshow_timer: false,
                        force_update: true,
                    });
                } else if (page === 'settings') {
                    ext.send_msg({
                        msg: 'get_background',
                        allow_to_start_slideshow_timer: false,
                        force_update: true,
                    });
                }
            }
        }, 'cnt_1112');

    public set_future_background_id = (): Promise<void> =>
        err_async(async () => {
            const settings: i_data.Settings = await ext.storage_get();
            const background_count: number = await db.backgrounds.count();
            const current_background_is_the_only_background: boolean = background_count === 1;

            if (!current_background_is_the_only_background && settings.shuffle_backgrounds) {
                settings.future_background_id = await this.get_id_of_random_background();
            } else {
                const backgrounds: i_db.Background[] =
                    await s_db.Manipulation.i().get_backgrounds();

                const i_of_background_with_current_id: number = s_i.Main.i().find_i_of_item_with_id(
                    {
                        id: settings.current_background_id,
                        items: backgrounds,
                    },
                );

                if (i_of_background_with_current_id !== -1) {
                    const current_background_is_last_background: boolean =
                        background_count - 1 === i_of_background_with_current_id;
                    if (current_background_is_last_background) {
                        settings.future_background_id = n(backgrounds[0])
                            ? backgrounds[0].id
                            : this.reset_val;
                    } else {
                        settings.future_background_id = n(
                            backgrounds[i_of_background_with_current_id + 1],
                        )
                            ? backgrounds[i_of_background_with_current_id + 1].id
                            : this.reset_val;
                    }
                }
            }

            if (page === 'background') {
                await s_data.Main.i().update_settings({
                    settings,
                });

                ext.send_msg({ msg: 'update_settings_settings' });
            } else if (page === 'settings') {
                data.settings.future_background_id = settings.future_background_id;

                await ext.send_msg_resp({
                    msg: 'update_settings_background',
                    settings,
                    update_instantly: true,
                });
            }
        }, 'cnt_1315');

    private get_id_of_random_background = (): Promise<string | number> =>
        err_async(async () => {
            const settings: i_data.Settings = await ext.storage_get();
            const background_count: number = await db.backgrounds.count();
            let future_background_id: string | number = 0;

            while (
                future_background_id === 0 ||
                future_background_id === settings.current_background_id
            ) {
                const random_background_i = _.random(0, background_count - 1);
                // eslint-disable-next-line no-await-in-loop
                const random_background = await db.backgrounds.offset(random_background_i).first();

                if (n(random_background)) {
                    future_background_id = random_background.id;
                }
            }

            return future_background_id;
        }, 'cnt_1316');
}
