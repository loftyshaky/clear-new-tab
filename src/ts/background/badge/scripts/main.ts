export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public set_badge_text = ({
        uploading_theme_background,
    }: {
        uploading_theme_background: boolean;
    }): Promise<void> =>
        err_async(async () => {
            let badge_text: string = '';

            if (uploading_theme_background) {
                badge_text = '\uD83E\uDC47';
            }

            await we.action.setBadgeText({ text: badge_text });
        }, 'cnt_1514');

    public set_badge_color = (): Promise<void> =>
        err_async(async () => {
            await we.action.setBadgeTextColor({ color: 'white' });
            await we.action.setBadgeBackgroundColor({ color: '#a048b0' });
        }, 'cnt_1515');
}
