import { s_theme as s_theme_shared } from '@loftyshaky/shared';
import { s_theme } from 'shared/internal';

export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public reset_theme = ({
        transition_duration,
    }: {
        transition_duration: number;
    }): Promise<void> =>
        err_async(async () => {
            await x.delay(transition_duration);

            await s_theme_shared.Main.i().set({
                name: data.settings.options_page_theme,
                additional_theme_callback: s_theme.Main.i().set,
            });
        }, 'cnt_1301');
}
