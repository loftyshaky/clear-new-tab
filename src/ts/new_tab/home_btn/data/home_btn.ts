import { computed, makeObservable } from 'mobx';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {
        makeObservable(this, {
            show_home_btn: computed,
        });
    }

    public get show_home_btn() {
        return data.settings.prefs.home_btn_is_visible;
    }
}

export const HomeBtn = Class.get_instance();
