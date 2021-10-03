export class Visibility {
    private static i0: Visibility;

    public static i(): Visibility {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public hide_color_help = (): void =>
        err(() => {
            ext.send_msg_resp({
                msg: 'update_settings',
                settings: { color_help_is_visible: false },
            });
        }, 'cnt_1146');
}
