export class Preview {
    private static i0: Preview;

    public static i(): Preview {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
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
