class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public open = ({ background_id }: { background_id: string }): void =>
        err(() => {
            const url: string = we.runtime.getURL(
                `new_tab.html?preview_background_id=${background_id}`,
            );

            we.tabs.create({ active: true, url });
        }, 'cnt_1002');
}

export const Preview = Class.get_instance();
