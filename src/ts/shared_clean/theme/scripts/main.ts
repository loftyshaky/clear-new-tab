export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public set = ({ name, el = document.head }: { name: string; el?: HTMLElement }): void =>
        err(() => {
            const name_final = `settings_${name}_theme`;
            x.css(name_final, el, 'settings_theme_link');
        }, 'cnt_1368');
}
