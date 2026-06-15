class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {}

    public hide = (): void =>
        err(() => {
            x.css('global_hidden', document.head);
        }, 'cnt_1090');

    public show = (): void =>
        err(() => {
            x.remove(s('.global_hidden_link'));
        }, 'cnt_1091');
}

export const GlobalOptions = Class.get_instance();
