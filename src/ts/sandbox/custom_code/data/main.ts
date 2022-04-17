import { makeObservable, observable, action } from 'mobx';

import * as i_db from 'shared/db/interfaces';

export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    private constructor() {
        makeObservable(this, {
            key: observable,
            custom_code: observable,
            set_custom_code: action,
        });
    }

    public key: number = 0; // needed to remount component on js update
    public custom_code: i_db.CustomCode = { html: '', css: '', js: '' };

    public set_custom_code = ({ custom_code }: { custom_code: i_db.CustomCode }): void => {
        this.key += 1;
        this.custom_code = custom_code;
    };
}
