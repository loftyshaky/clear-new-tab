class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public open_default_new_tab_page = (): void =>
        err(() => {
            ext.send_msg({ msg: 'open_default_new_tab_page' });
        }, 'cnt_1077');
}

export const HomeBtn = Class.get_instance();
