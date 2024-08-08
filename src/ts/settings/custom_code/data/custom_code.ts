import { makeObservable, observable, action, runInAction } from 'mobx';

import { s_custom_code, i_db, s_db } from 'shared_clean/internal';
import { i_custom_code } from 'settings/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {
        makeObservable(this, {
            custom_code: observable,
            set_custom_code_item: action,
        });
    }

    public custom_code: i_db.CustomCode = s_custom_code.CustomCode.default_custom_code;

    public set_custom_code = ({
        custom_code,
    }: { custom_code?: i_db.CustomCode } = {}): Promise<void> =>
        err_async(async () => {
            const custom_code_final: i_db.CustomCode = n(custom_code)
                ? custom_code
                : await s_db.Manipulation.get_custom_code();

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

export const CustomCode = Class.get_instance();
