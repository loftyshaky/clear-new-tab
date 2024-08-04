import { makeObservable, observable, action } from 'mobx';

import * as s_custom_code from 'shared_clean/custom_code/scripts';
import * as i_db from 'shared_clean/db/interfaces';

export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    private constructor() {
        makeObservable(this, {
            custom_code: observable,
            set_custom_code: action,
        });
    }

    public custom_code: i_db.CustomCode = s_custom_code.Main.i().default_custom_code;

    public set_custom_code = ({ custom_code }: { custom_code: i_db.CustomCode }): void => {
        this.custom_code = custom_code;
    };
}
