import { d_color } from '@loftyshaky/shared/inputs';

export class Storage {
    private static i0: Storage;

    public static i(): Storage {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public set_preload_color = (): void =>
        err(() => {
            if (data.ui.settings_context === 'global') {
                localStorage.setItem(
                    'preload_color',
                    d_color.Color.i().access_from_val({
                        val: data.settings.color_of_area_around_background,
                    }),
                );
            }
        }, 'cnt_1363');
}
