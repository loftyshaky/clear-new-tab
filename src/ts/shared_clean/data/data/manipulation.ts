import { s_data } from '@loftyshaky/shared/shared_clean';
import { i_data } from 'shared_clean/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public send_msg_to_update_settings = ({
        settings,
        replace = false,
        transform = false,
        transform_force = false,
        load_settings = false,
        restore_back_up = false,
        update_instantly = false,
        update_background = false,
    }: {
        settings?: i_data.Settings;
        replace?: boolean;
        transform?: boolean;
        transform_force?: boolean;
        update_instantly?: boolean;
        load_settings?: boolean;
        restore_back_up?: boolean;
        update_background?: boolean;
    }): Promise<void> =>
        err_async(async () => {
            await s_data.Cache.set({
                key: 'updating_settings',
                val: true,
            });

            await ext.send_msg_resp({
                msg: 'update_settings_background',
                settings,
                replace,
                update_background,
                update_instantly,
                transform,
                transform_force,
                load_settings,
                restore_back_up,
            });
        }, 'aer_1124');
}

export const Manipulation = Class.get_instance();
