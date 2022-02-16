import _ from 'lodash';

import { db, s_data, s_db, i_data, i_db } from 'shared/internal';

export class CurrentBackground {
    private static i0: CurrentBackground;

    public static i(): CurrentBackground {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public find_i_of_background_with_id = ({
        id,
        backgrounds,
    }: {
        id: number | string;
        backgrounds: i_db.Background[];
    }): number =>
        err(
            () =>
                backgrounds.findIndex((background: i_db.Background): boolean =>
                    err(() => background.id === id, 'cnt_56538'),
                ),
            'cnt_54723',
        );

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

                const i_of_background_with_current_id: number = this.find_i_of_background_with_id({
                    id: settings.current_background_id,
                    backgrounds,
                });

                if (i_of_background_with_current_id !== -1) {
                    const current_background_is_last_background: boolean =
                        background_count - 1 === i_of_background_with_current_id;
                    if (current_background_is_last_background) {
                        settings.future_background_id = n(backgrounds[0]) ? backgrounds[0].id : 1;
                    } else {
                        settings.future_background_id = n(
                            backgrounds[i_of_background_with_current_id + 1],
                        )
                            ? backgrounds[i_of_background_with_current_id + 1].id
                            : 1;
                    }
                }
            }

            if (page === 'background') {
                await s_data.Main.i().update_settings({
                    settings,
                });
            } else if (page === 'settings') {
                data.settings.future_background_id = settings.future_background_id;

                await ext.send_msg_resp({
                    msg: 'update_settings',
                    settings,
                    update_instantly: true,
                });
            }
        }, 'cnt_43673');

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
        }, 'cnt_64356');
}
