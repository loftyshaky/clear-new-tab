import debounce from 'lodash/debounce';

import { s_custom_code as s_custom_code_shared_clean, s_db, i_db } from 'shared_clean/internal';
import { d_custom_code, i_custom_code } from 'settings/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public save_custom_code = ({ custom_code }: { custom_code: i_db.CustomCode }): Promise<void> =>
        err_async(async () => {
            await s_db.Manipulation.save_custom_code({ custom_code });
            await d_custom_code.CustomCode.set_custom_code({
                custom_code,
            });

            await ext.send_msg_resp({ msg: 'set_custom_code' });
        }, 'cnt_1201');

    public save_val = ({ type, val }: { type: i_custom_code.Type; val: string }): Promise<void> =>
        err_async(async () => {
            const custom_code: i_db.CustomCode = { [type]: val };

            await s_db.Manipulation.save_custom_code({ custom_code });

            await d_custom_code.CustomCode.set_custom_code_item({
                type,
                val,
            });

            await ext.send_msg({ msg: 'set_custom_code' });
        }, 'cnt_1202');

    public save_val_debounce = debounce(this.save_val, 250);

    public delete_custom_code = (): Promise<void> =>
        err_async(async () => {
            // eslint-disable-next-line no-alert
            if (globalThis.confirm(ext.msg('delete_custom_code_confirm'))) {
                await this.save_custom_code({
                    custom_code: s_custom_code_shared_clean.CustomCode.default_custom_code,
                });
            }
        }, 'cnt_1203');
}

export const Db = Class.get_instance();
