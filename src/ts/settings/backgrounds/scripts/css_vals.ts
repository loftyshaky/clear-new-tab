class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public get_gap = (): number =>
        err(() => {
            const section_content = s<HTMLDivElement>('.section_content');
            if (n(section_content)) {
                const gap: number = x.get_numeric_css_val(section_content, 'padding');

                return gap;
            }

            return 0;
        }, 'cnt_1146');
}

export const CssVals = Class.get_instance();
