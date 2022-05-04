import _ from 'lodash';
import { runInAction, toJS } from 'mobx';

import { t } from '@loftyshaky/shared';
import { i_data } from 'shared/internal';

export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    private set = ({ settings }: { settings?: i_data.Settings } = {}): Promise<void> =>
        err_async(async () => {
            let settings_final: i_data.Settings;

            if (n(settings)) {
                if (_.isEmpty(settings)) {
                    const default_settings = await ext.send_msg_resp({ msg: 'get_defaults' });

                    settings_final = default_settings;
                } else {
                    settings_final = settings;
                }
            }

            runInAction(() =>
                err(() => {
                    data.settings = settings_final;
                }, 'cnt_1364'),
            );
        }, 'cnt_1365');

    public change = ({ key, val }: { key: string; val: t.AnyUndefined }): void =>
        err(() => {
            data.settings[key] = val;

            ext.send_msg_resp({
                msg: 'update_settings_background',
                settings: { [key]: val },
            });
        }, 'cnt_1366');

    public set_from_storage = (): Promise<void> =>
        err_async(async () => {
            const settings = await ext.storage_get();

            if (_.isEmpty(settings)) {
                const default_settings = await ext.send_msg_resp({ msg: 'get_defaults' });

                await ext.storage_set(default_settings);
            }

            if (!_.isEqual(toJS(data.settings), settings)) {
                this.set({ settings });
            }
        }, 'cnt_1367');
}
