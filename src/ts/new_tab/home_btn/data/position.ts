import { makeObservable, computed } from 'mobx';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {
        makeObservable(this, {
            position: computed,
        });
    }

    public get position() {
        return `home_btn_${data.settings.home_btn_position}`;
    }
}

export const Position = Class.get_instance();
