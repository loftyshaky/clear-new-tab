import { makeObservable, observable, action, runInAction } from 'mobx';

import { s_custom_code, i_db, s_db } from 'shared_clean/internal';
import { i_custom_code } from 'settings/internal';

export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    private constructor() {
        makeObservable(this, {
            custom_code: observable,
            set_custom_code_item: action,
        });
    }

    public custom_code: i_db.CustomCode = s_custom_code.Main.i().default_custom_code;

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
                }, 'cnt_1185'),
            );
        }, 'cnt_1186');

    public set_custom_code_item = ({
        type,
        val,
    }: {
        type: i_custom_code.Type;
        val: string;
    }): void =>
        err(() => {
            this.custom_code[type] = val;
        }, 'cnt_1187');
}
