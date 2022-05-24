export class LinkToImage {
    private static i0: LinkToImage;

    public static i(): LinkToImage {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public open = (): void =>
        err(() => {
            we.tabs.create({ url: 'chrome://theme/IDR_THEME_NTP_BACKGROUND' });
        }, 'cnt_1004');
}
