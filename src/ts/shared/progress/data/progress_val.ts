import { makeObservable, observable, action } from 'mobx';

import { d_progress } from 'shared/internal';

export class ProgressVal {
    private static i0: ProgressVal;

    public static i(): ProgressVal {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    private constructor() {
        makeObservable(this, {
            progress_max: observable,
            progress_val: observable,
            reset_progress_val: action,
            set_progress_max: action,
            increment_progress: action,
        });
    }

    public progress_max: number = 0;
    public progress_val: number = 0;
    public reset_progress_val = (): void =>
        err(() => {
            this.progress_val = 0;
        }, 'cnt_1439');

    public set_progress_max = ({ progress_max }: { progress_max: number }): void =>
        err(() => {
            d_progress.Status.i().set({ status: 'processing' });

            this.progress_max = progress_max;
        }, 'cnt_1433');

    public increment_progress = ({ increment_amount }: { increment_amount: number }): void =>
        err(() => {
            this.progress_val += increment_amount;

            if (this.progress_val === this.progress_max) {
                d_progress.Status.i().set({ status: 'finalizing' });
            }
        }, 'cnt_1434');
}
