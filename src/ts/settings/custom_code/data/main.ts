import { makeObservable, observable, action, runInAction } from 'mobx';

import { i_db, s_db } from 'shared/internal';
import { i_custom_code } from 'settings/internal';

export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {
        makeObservable(this, {
            custom_code: observable,
            set_custom_code_item: action,
        });
    }

    public custom_code: i_db.CustomCode = { html: '', css: '', js: '' };

    public set_custom_code = ({
        custom_code,
    }: { custom_code?: i_db.CustomCode } = {}): Promise<void> =>
        err_async(async () => {
            const custom_code_final: i_db.CustomCode = n(custom_code)
                ? custom_code
                : await s_db.Manipulation.i().get_custom_code();

            runInAction(() =>
                err(() => {
                    this.custom_code = custom_code_final;
                }, 'cnt_74757'),
            );
        }, 'cnt_64646');

    public set_custom_code_item = ({
        type,
        val,
    }: {
        type: i_custom_code.Type;
        val: string;
    }): void =>
        err(() => {
            this.custom_code[type] = val;
        }, 'cnt_64646');
}
