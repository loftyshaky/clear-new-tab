import { makeObservable, observable, computed, action } from 'mobx';

import { i_progress } from 'shared/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {
        makeObservable<this, 'status'>(this, {
            status: observable,
            status_text: computed,
            set: action,
        });
    }

    public status: i_progress.Status = 'pre_processing';

    public get status_text(): string {
        return ext.msg(`${this.status}_status_text`);
    }

    public set = ({ status }: { status: i_progress.Status }): void =>
        err(() => {
            this.status = status;
        }, 'cnt_1437');
}

export const Status = Class.get_instance();
