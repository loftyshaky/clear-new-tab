class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {}

    public open = ({ background_id }: { background_id: string }): void =>
        err(() => {
            const url: string = we.runtime.getURL(
                `new_tab.html?preview_background_id=${background_id}`,
            );

            void we.tabs.create({ active: true, url });
        }, 'cnt_1002');
}

export const Preview = Class.get_instance();
