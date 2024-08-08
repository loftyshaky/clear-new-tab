import { makeObservable, observable, action } from 'mobx';

import { d_progress } from 'shared/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
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
            d_progress.Status.set({ status: 'processing' });

            this.progress_max = progress_max;
        }, 'cnt_1433');

    public increment_progress = ({ increment_amount }: { increment_amount: number }): void =>
        err(() => {
            this.progress_val += increment_amount;

            if (this.progress_val === this.progress_max) {
                d_progress.Status.set({ status: 'finalizing' });
            }
        }, 'cnt_1434');
}

export const ProgressVal = Class.get_instance();
