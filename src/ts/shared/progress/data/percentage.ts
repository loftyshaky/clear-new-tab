import { makeObservable, computed } from 'mobx';

import { d_progress } from 'shared/internal';

export class Percentage {
    private static i0: Percentage;

    public static i(): Percentage {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    private constructor() {
        makeObservable(this, {
            percentage: computed,
        });
    }

    public get percentage(): string {
        return `${
            d_progress.Status.i().status === 'pre_processing'
                ? 0
                : x.percentage(
                      d_progress.ProgressVal.i().progress_val,
                      d_progress.ProgressVal.i().progress_max,
                      true,
                  )
        }%`;
    }
}
