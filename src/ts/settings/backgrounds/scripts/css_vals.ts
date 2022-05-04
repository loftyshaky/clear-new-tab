export class CssVals {
    private static i0: CssVals;

    public static i(): CssVals {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
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
