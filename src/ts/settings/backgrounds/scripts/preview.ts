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
            ext.send_msg({ msg: 'open_background_preview', background_id });
        }, 'cnt_1150');
}
