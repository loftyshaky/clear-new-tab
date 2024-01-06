export class TextBtns {
    private static i0: TextBtns;

    public static i(): TextBtns {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public decide_set_background_as_current_btn_visibility = (): boolean =>
        err(() => true, 'cnt_1282');

    public decide_paste_background_btn_visibility = (): boolean =>
        err(() => data.ui.paste_btn_is_visible, 'cnt_1283');
}
