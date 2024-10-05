import { d_data } from 'shared_clean/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public hide_color_help = (): void =>
        err(() => {
            d_data.Manipulation.send_msg_to_update_settings({
                settings: {
                    prefs: {
                        ...data.settings.prefs,
                        color_help_is_visible: false,
                    },
                },
                load_settings: true,
            });
        }, 'cnt_1295');
}

export const Visibility = Class.get_instance();
