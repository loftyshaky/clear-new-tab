import { makeObservable, computed } from 'mobx';

import { d_progress } from 'shared/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {
        makeObservable(this, {
            percentage: computed,
        });
    }

    public get percentage(): string {
        return `${
            d_progress.Status.status === 'pre_processing'
                ? 0
                : x.percentage(
                      d_progress.ProgressVal.progress_val,
                      d_progress.ProgressVal.progress_max,
                      true,
                  )
        }%`;
    }
}

export const Percentage = Class.get_instance();
