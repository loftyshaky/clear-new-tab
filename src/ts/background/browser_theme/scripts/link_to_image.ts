class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public open = (): void =>
        err(() => {
            we.tabs.create({ url: 'chrome://theme/IDR_THEME_NTP_BACKGROUND' });
        }, 'cnt_1004');
}

export const LinkToImage = Class.get_instance();
