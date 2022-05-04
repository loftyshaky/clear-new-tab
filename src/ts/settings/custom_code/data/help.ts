import { makeObservable, observable, computed, action } from 'mobx';

export class Help {
    private static i0: Help;

    public static i(): Help {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    private constructor() {
        makeObservable<this, 'help_is_visible'>(this, {
            help_is_visible: observable,
            help_visibility_cls: computed,
            custom_code_inner_visibility_cls: computed,
            change_help_visibility: action,
        });
    }

    private help_is_visible: boolean = false;

    public change_help_visibility = (): void =>
        err(() => {
            this.help_is_visible = !this.help_is_visible;
        }, 'cnt_1184');

    public get help_visibility_cls() {
        return this.help_is_visible ? '' : 'none';
    }

    public get custom_code_inner_visibility_cls() {
        return this.help_is_visible ? 'none' : '';
    }
}
