import { makeObservable, observable, computed, action } from 'mobx';

import { d_progress } from 'shared/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
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
                d_progress.ProgressVal.reset_progress_val();
                d_progress.Status.set({ status: 'pre_processing' });
            }

            this.is_visible = is_visible;
        }, 'cnt_1435');
}

export const Visibility = Class.get_instance();
