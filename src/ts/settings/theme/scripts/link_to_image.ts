class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {}

    public open = (): void =>
        err(() => {
            void ext.send_msg({ msg: 'open_theme_background' });
        }, 'cnt_1300');
}

export const LinkToImage = Class.get_instance();
