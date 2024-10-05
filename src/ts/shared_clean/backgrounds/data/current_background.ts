import random from 'lodash/random';

import { run_in_action_placeholder } from '@loftyshaky/shared/shared_clean';
import {
    db,
    d_backgrounds,
    d_data,
    s_background,
    s_data,
    s_db,
    s_i,
    i_db,
} from 'shared_clean/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public reset_val: number = 0;

    public set_current_background_i = ({
        backgrounds,
        current_background_id,
        run_in_action = run_in_action_placeholder,
    }: {
        backgrounds: i_db.Background[];
        current_background_id?: string | number;
        run_in_action?: any;
    }): void =>
        err(() => {
            const no_backgrounds_exist: boolean = backgrounds.length === 0;

            run_in_action(() =>
                err(() => {
                    if (no_backgrounds_exist) {
                        data.ui.current_background_i = d_backgrounds.CurrentBackground.reset_val;
                    } else {
                        const i_of_background_with_current_id: number =
                            s_i.I.find_i_of_item_with_id({
                                id: n(current_background_id)
                                    ? current_background_id
                                    : data.settings.prefs.current_background_id,
                                items: backgrounds,
                            });

                        data.ui.current_background_i = i_of_background_with_current_id + 1;
                    }
                }, 'cnt_1523'),
            );
        }, 'cnt_1111');

    public set_background_as_current = ({
        id,
        backgrounds,
        run_in_action = run_in_action_placeholder,
    }: {
        id: string | number | undefined;
        backgrounds: i_db.Background[];
        run_in_action?: any;
    }): Promise<void> =>
        err_async(async () => {
            if (n(id)) {
                run_in_action(() =>
                    err(() => {
                        data.settings.prefs.current_background_id = id;

                        this.set_current_background_i({
                            backgrounds,
                            current_background_id: id,
                        });

                        if (id === 0) {
                            data.settings.prefs.future_background_id = id;
                        }

                        data.settings.prefs.background_change_time = new Date().getTime();
                    }, 'cnt_1520'),
                );

                if (page === 'background') {
                    await s_data.Manipulation.update_settings({
                        settings: data.settings,
                        load_settings: true,
                    });
                } else if (page === 'settings') {
                    await d_data.Manipulation.send_msg_to_update_settings({
                        settings: data.settings,
                        load_settings: true,
                        update_instantly: true,
                    });
                }

                this.set_future_background_id();

                if (page === 'background') {
                    s_background.BackgroundChange.try_to_change_background({
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
            const background_count: number = await db.backgrounds.count();
            const current_background_is_the_only_background: boolean = background_count === 1;

            if (
                !current_background_is_the_only_background &&
                data.settings.prefs.shuffle_backgrounds
            ) {
                data.settings.prefs.future_background_id = await this.get_id_of_random_background();
            } else {
                const backgrounds: i_db.Background[] = await s_db.Manipulation.get_backgrounds();

                const i_of_background_with_current_id: number = s_i.I.find_i_of_item_with_id({
                    id: data.settings.prefs.current_background_id,
                    items: backgrounds,
                });

                if (i_of_background_with_current_id !== -1) {
                    const current_background_is_last_background: boolean =
                        background_count - 1 === i_of_background_with_current_id;
                    if (current_background_is_last_background) {
                        data.settings.prefs.future_background_id = n(backgrounds[0])
                            ? backgrounds[0].id
                            : this.reset_val;
                    } else {
                        data.settings.prefs.future_background_id = n(
                            backgrounds[i_of_background_with_current_id + 1],
                        )
                            ? backgrounds[i_of_background_with_current_id + 1].id
                            : this.reset_val;
                    }
                }
            }

            if (page === 'background') {
                await s_data.Manipulation.update_settings({
                    settings: data.settings,
                    load_settings: true,
                });

                ext.send_msg({ msg: 'update_settings_settings' });
            } else if (page === 'settings') {
                await d_data.Manipulation.send_msg_to_update_settings({
                    settings: data.settings,
                    load_settings: true,
                    update_instantly: true,
                });
            }
        }, 'cnt_1315');

    private get_id_of_random_background = (): Promise<string | number> =>
        err_async(async () => {
            const background_count: number = await db.backgrounds.count();
            let future_background_id: string | number = 0;

            while (
                future_background_id === 0 ||
                future_background_id === data.settings.prefs.current_background_id
            ) {
                const random_background_i = random(0, background_count - 1);
                // eslint-disable-next-line no-await-in-loop
                const random_background = await db.backgrounds.offset(random_background_i).first();

                if (n(random_background)) {
                    future_background_id = random_background.id;
                }
            }

            return future_background_id;
        }, 'cnt_1316');
}

export const CurrentBackground = Class.get_instance();
