import { makeObservable, observable, action } from 'mobx';

export class Visibility {
    private static i0: Visibility;

    public static i(): Visibility {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
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
