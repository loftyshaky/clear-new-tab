export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public open_default_new_tab_page = (): void =>
        err(() => {
            we.tabs.update({
                url:
                    env.browser === 'edge'
                        ? 'https://ntp.msn.com/edge/ntp?sp=Bing'
                        : 'chrome://new-tab-page',
            });
        }, 'cnt_1009');
}
