export class GlobalOptions {
    private static i0: GlobalOptions;

    public static i(): GlobalOptions {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public hide = (): void =>
        err(() => {
            x.css('global_hidden', document.head);
        }, 'cnt_64368');

    public show = (): void =>
        err(() => {
            l(s('.global_hidden_link'));
            x.remove(s('.global_hidden_link'));
        }, 'cnt_46367');
}
