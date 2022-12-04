import { makeObservable, observable, computed, action } from 'mobx';

import { i_progress } from 'shared/internal';

export class Status {
    private static i0: Status;

    public static i(): Status {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
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
