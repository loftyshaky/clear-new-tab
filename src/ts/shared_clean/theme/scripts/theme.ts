class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public set = ({ name, el = document.head }: { name: string; el?: HTMLElement }): void =>
        err(() => {
            const name_final = `settings_${name}_theme`;

            x.css(name_final, el, 'settings_theme_link');
        }, 'cnt_1368');
}

export const Theme = Class.get_instance();
