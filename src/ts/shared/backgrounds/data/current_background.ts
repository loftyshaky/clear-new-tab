import { makeObservable, action, runInAction } from 'mobx';
import { d_backgrounds, i_db } from 'shared_clean/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {
        makeObservable<Class, 'set_current_background_i'>(this, {
            set_current_background_i: action,
        });
    }

    public reset_val: number = 0;

    public set_current_background_i = ({
        backgrounds,
        current_background_id,
        adjusting_current_background_number_by_keyboard = false,
    }: {
        backgrounds: i_db.Background[];
        current_background_id?: string | number;
        adjusting_current_background_number_by_keyboard?: boolean;
    }): void =>
        err(() => {
            d_backgrounds.CurrentBackground.set_current_background_i({
                backgrounds,
                current_background_id,
                adjusting_current_background_number_by_keyboard,
                run_in_action: runInAction,
            });
        }, 'cnt_1522');

    public set_background_as_current = ({
        id,
        backgrounds,
        adjusting_current_background_number_by_keyboard = false,
        force = false,
    }: {
        id: string | number | undefined;
        backgrounds: i_db.Background[];
        adjusting_current_background_number_by_keyboard: boolean;
        force?: boolean;
    }): Promise<void> =>
        err_async(async () => {
            await d_backgrounds.CurrentBackground.set_background_as_current({
                id,
                backgrounds,
                adjusting_current_background_number_by_keyboard,
                force,
                run_in_action: runInAction,
            });
        }, 'cnt_1521');
}

export const CurrentBackground = Class.get_instance();
