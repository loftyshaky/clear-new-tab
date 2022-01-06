import { d_background } from 'new_tab/internal';

export class Type {
    private static i0: Type;

    public static i(): Type {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public is_img_file = (): boolean =>
        err(
            () =>
                n(d_background.Main.i().current_background_data) &&
                d_background.Main.i().current_background_data!.type.includes('img_file'),
            'cnt_43453',
        );

    public is_img_link = (): boolean =>
        err(
            () =>
                n(d_background.Main.i().current_background_data) &&
                d_background.Main.i().current_background_data!.type === 'img_link',
            'cnt_43453',
        );

    public is_img = (): boolean =>
        err(() => this.is_img_file() || this.is_img_link(), 'cnt_533535');

    public is_color = (): boolean =>
        err(
            () =>
                n(d_background.Main.i().current_background_data) &&
                d_background.Main.i().current_background_data!.type.includes('color'),
            'cnt_53575',
        );

    public is_video = (): boolean =>
        err(
            () =>
                n(d_background.Main.i().current_background_data) &&
                d_background.Main.i().current_background_data!.type.includes('video'),
            'cnt_67543',
        );
}
