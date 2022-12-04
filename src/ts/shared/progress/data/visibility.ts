import { makeObservable, observable, computed, action } from 'mobx';

import { d_progress } from 'shared/internal';

export class Visibility {
    private static i0: Visibility;

    public static i(): Visibility {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    private constructor() {
        makeObservable(this, {
            is_visible: observable,
            progress_bar_is_visible_cls: computed,
            change: action,
        });
    }

    public is_visible: boolean = false;

    public get progress_bar_is_visible_cls(): string {
        return this.is_visible ? '' : 'none';
    }

    public change = ({ is_visible }: { is_visible: boolean }): void =>
        err(() => {
            if (is_visible) {
                d_progress.ProgressVal.i().reset_progress_val();
                d_progress.Status.i().set({ status: 'pre_processing' });
            }

            this.is_visible = is_visible;
        }, 'cnt_1435');
}
