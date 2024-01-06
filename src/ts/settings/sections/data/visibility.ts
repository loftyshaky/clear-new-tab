export class Visibility {
    private static i0: Visibility;

    public static i(): Visibility {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public hide_color_help = (): void =>
        err(() => {
            ext.send_msg({
                msg: 'update_settings_background',
                settings: { color_help_is_visible: false },
            });
        }, 'cnt_1295');
}
