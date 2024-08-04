import { makeObservable, action, runInAction } from 'mobx';

import { d_backgrounds, i_db } from 'shared_clean/internal';

export class CurrentBackground {
    private static i0: CurrentBackground;

    public static i(): CurrentBackground {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    private constructor() {
        makeObservable<CurrentBackground, 'set_current_background_i'>(this, {
            set_current_background_i: action,
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
            d_backgrounds.CurrentBackground.i().set_current_background_i({
                backgrounds,
                current_background_id,
                run_in_action: runInAction,
            });
        }, 'cnt_1522');

    public set_background_as_current = ({
        id,
        backgrounds,
    }: {
        id: string | number | undefined;
        backgrounds: i_db.Background[];
    }): Promise<void> =>
        err_async(async () => {
            await d_backgrounds.CurrentBackground.i().set_background_as_current({
                id,
                backgrounds,
                run_in_action: runInAction,
            });
        }, 'cnt_1521');
}
