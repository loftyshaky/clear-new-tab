export class BackgroundId {
    private static i0: BackgroundId;

    public static i(): BackgroundId {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public copy_to_clipboard = ({ background_id }: { background_id: string }): Promise<void> =>
        err_async(async () => {
            await navigator.clipboard.writeText(background_id);
        }, 'cnt_63567');
}
