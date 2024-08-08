class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public open = (): void =>
        err(() => {
            ext.send_msg({ msg: 'open_theme_background' });
        }, 'cnt_1300');
}

export const LinkToImage = Class.get_instance();
