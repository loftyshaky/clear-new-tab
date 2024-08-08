class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public decide_set_background_as_current_btn_visibility = (): boolean =>
        err(() => true, 'cnt_1282');

    public decide_paste_background_btn_visibility = (): boolean =>
        err(() => data.ui.paste_btn_is_visible, 'cnt_1283');
}

export const TextBtns = Class.get_instance();
