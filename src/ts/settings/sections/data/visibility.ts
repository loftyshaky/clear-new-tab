class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public hide_color_help = (): void =>
        err(() => {
            ext.send_msg({
                msg: 'update_settings_background',
                settings: { color_help_is_visible: false },
            });
        }, 'cnt_1295');
}

export const Visibility = Class.get_instance();
