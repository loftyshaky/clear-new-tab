import { makeObservable, observable, action } from 'mobx';

export class Page {
    private static i0: Page;

    public static i(): Page {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    private constructor() {
        makeObservable(this, {
            page: observable,
            change: action,
        });
    }

    public page: number = 1;

    public change = (page: number): void =>
        err(() => {
            this.page = page;
        }, 'cnt_1442');
}
