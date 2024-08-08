class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
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

export const Badge = Class.get_instance();
