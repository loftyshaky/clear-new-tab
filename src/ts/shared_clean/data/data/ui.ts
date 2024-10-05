class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public create_ui_objs = (): void =>
        err(() => {
            data.ui = {};
        }, 'cnt_1318');
}

export const Ui = Class.get_instance();
