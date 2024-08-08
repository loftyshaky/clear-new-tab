import { makeObservable, observable, action } from 'mobx';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {
        makeObservable(this, {
            is_visible: observable,
            change: action,
        });
    }

    public is_visible: boolean = false;

    public change = ({ is_visible }: { is_visible: boolean }): void =>
        err(() => {
            this.is_visible = is_visible;
        }, 'cnt_1267');
}

export const Visibility = Class.get_instance();
