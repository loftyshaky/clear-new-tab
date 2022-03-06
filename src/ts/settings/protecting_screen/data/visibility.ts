import { makeObservable, observable, computed, action } from 'mobx';

export class Visibility {
    private static i0: Visibility;

    public static i(): Visibility {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {
        makeObservable<this, 'is_visible' | 'show' | 'hide'>(this, {
            is_visible: observable,
            visibility_cls: computed,
            show: action,
            hide: action,
        });
    }

    private is_visible: boolean = false;

    public show = (): void =>
        err(() => {
            this.is_visible = true;
        }, 'cnt_64345');

    public hide = (): void =>
        err(() => {
            this.is_visible = false;
        }, 'cnt_64345');

    public get visibility_cls() {
        return this.is_visible ? '' : 'none';
    }
}
