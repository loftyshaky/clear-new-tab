class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
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

export const HomeBtn = Class.get_instance();
