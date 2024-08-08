import { d_color } from '@loftyshaky/shared/inputs';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public set_preload_color = (): void =>
        err(() => {
            if (data.ui.settings_context === 'global') {
                localStorage.setItem(
                    'preload_color',
                    d_color.Color.access_from_val({
                        val: data.settings.color_of_area_around_background,
                    }),
                );
            }
        }, 'cnt_1363');
}

export const Storage = Class.get_instance();
