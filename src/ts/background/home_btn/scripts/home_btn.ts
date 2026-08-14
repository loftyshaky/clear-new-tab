import { s_links } from '@loftyshaky/shared/shared_clean';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {}

    public opening_default_new_tab_page: number = 0;

    public open_default_new_tab_page = (): void =>
        err(() => {
            this.opening_default_new_tab_page = 3;

            void we.tabs.update({
                url:
                    data.settings.prefs.homepage === ''
                        ? s_links.Browser.new_tab[env.browser]
                        : data.settings.prefs.homepage,
            });
        }, 'cnt_1009');
}

export const HomeBtn = Class.get_instance();
