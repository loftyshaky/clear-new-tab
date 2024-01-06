export class LinkToImage {
    private static i0: LinkToImage;

    public static i(): LinkToImage {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public open = (): void =>
        err(() => {
            ext.send_msg({ msg: 'open_theme_background' });
        }, 'cnt_1300');
}
