import { makeObservable, observable, action } from 'mobx';

import * as s_custom_code from 'shared_clean/custom_code/scripts';
import * as i_db from 'shared_clean/db/interfaces';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {
        makeObservable(this, {
            custom_code: observable,
            set_custom_code: action,
        });
    }

    public custom_code: i_db.CustomCode = s_custom_code.CustomCode.default_custom_code;

    public set_custom_code = ({ custom_code }: { custom_code: i_db.CustomCode }): void => {
        this.custom_code = custom_code;
    };
}

export const CustomCode = Class.get_instance();
