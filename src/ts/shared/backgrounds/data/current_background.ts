import _ from 'lodash';
import { autorun } from 'mobx';

import { d_backgrounds, db, i_db } from 'shared/internal';

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
        id: string;
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
            const background_count: number = await db.backgrounds.count();
            const current_background_is_the_only_background: boolean = background_count === 1;

            if (!current_background_is_the_only_background && data.settings.shuffle_backgrounds) {
                data.settings.future_background_id = await this.get_id_of_random_background();
            } else {
                const backgrounds: i_db.Background[] = await db.backgrounds.toArray();

                d_backgrounds.Main.i().sort_backgrounds({ backgrounds });

                const i_of_background_with_current_id: number = this.find_i_of_background_with_id({
                    id: data.settings.current_background_id,
                    backgrounds,
                });

                if (i_of_background_with_current_id !== -1) {
                    const current_background_is_last_background: boolean =
                        background_count - 1 === i_of_background_with_current_id;

                    if (current_background_is_last_background) {
                        data.settings.future_background_id = n(backgrounds[0])
                            ? backgrounds[0].id
                            : 1;
                    } else {
                        data.settings.future_background_id = n(
                            backgrounds[i_of_background_with_current_id + 1],
                        )
                            ? backgrounds[i_of_background_with_current_id + 1].id
                            : 1;
                    }
                }
            }

            await ext.send_msg_resp({
                msg: 'update_settings',
                settings: {
                    current_background_id: data.settings.current_background_id,
                    future_background_id: data.settings.future_background_id,
                },
                update_instantly: true,
            });
        }, 'cnt_43673');

    public set_future_background_id_autorun = (): void =>
        err(() => {
            autorun(() => {
                // eslint-disable-next-line no-unused-expressions
                data.settings.current_background_id;

                this.set_future_background_id();
            });
        }, 'cnt_43673');

    private get_id_of_random_background = (): Promise<string | number> =>
        err_async(async () => {
            const background_count: number = await db.backgrounds.count();
            let future_background_id: string | number = 0;

            while (
                future_background_id === 0 ||
                future_background_id === data.settings.current_background_id
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
