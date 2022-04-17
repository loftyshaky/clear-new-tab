import _ from 'lodash';

import { s_db, i_db } from 'shared/internal';
import { d_custom_code, i_custom_code } from 'settings/internal';

export class Db {
    private static i0: Db;

    public static i(): Db {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public save_custom_code = ({ custom_code }: { custom_code: i_db.CustomCode }): void =>
        err(() => {
            s_db.Manipulation.i().save_custom_code({ custom_code });
            d_custom_code.Main.i().set_custom_code({
                custom_code,
            });
        }, 'cnt_64557');

    public save_val = ({ type, val }: { type: i_custom_code.Type; val: string }): void =>
        err(() => {
            const custom_code: i_db.CustomCode = { [type]: val };
            s_db.Manipulation.i().save_custom_code({ custom_code });

            d_custom_code.Main.i().set_custom_code_item({
                type,
                val,
            });
        }, 'cnt_64675');

    public save_val_debounce = _.debounce(this.save_val, 250);
}
