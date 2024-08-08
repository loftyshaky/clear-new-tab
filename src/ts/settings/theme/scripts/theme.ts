import { s_theme as s_theme_shared } from '@loftyshaky/shared/shared';
import { s_theme } from 'shared_clean/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public reset = ({ transition_duration }: { transition_duration: number }): Promise<void> =>
        err_async(async () => {
            await x.delay(transition_duration);

            await s_theme_shared.Theme.set({
                name: data.settings.options_page_theme,
                additional_theme_callback: s_theme.Theme.set,
            });
        }, 'cnt_1301');
}

export const Theme = Class.get_instance();
