import _ from 'lodash';
import { runInAction } from 'mobx';

import { t } from '@loftyshaky/shared';
import { i_data } from 'shared/internal';

export class Restore {
    private static i0: Restore;

    public static i(): Restore {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public restore_confirm = ({ settings }: { settings?: i_data.Settings } = {}): Promise<void> =>
        err_async(async () => {
            // eslint-disable-next-line no-alert
            const confirmed_restore: boolean = self.confirm(ext.msg('restore_defaults_confirm'));

            if (confirmed_restore) {
                const settings_final: i_data.Settings = await this.set({ settings });

                await ext.send_msg_resp({
                    msg: 'update_settings',
                    settings: settings_final,
                    rerun_actions: true,
                });
            }
        }, 'cnt_1130');

    public restore_back_up = ({ data_obj }: { data_obj: t.AnyRecord }): Promise<void> =>
        err_async(async () => {
            const settings: i_data.Settings = {
                ...data_obj,
                ...this.get_unchanged_settings(),
            } as i_data.Settings;

            await this.set({ settings });

            await ext.send_msg_resp({
                msg: 'update_settings',
                settings,
                rerun_actions: true,
            });
        }, 'cnt_1131');

    private set = ({ settings }: { settings?: i_data.Settings } = {}): Promise<i_data.Settings> =>
        err_async(async () => {
            let settings_final: i_data.Settings;

            if (_.isEmpty(settings)) {
                const default_settings = await ext.send_msg_resp({ msg: 'get_defaults' });

                settings_final = { ...default_settings, ...this.get_unchanged_settings() };
            } else if (n(settings)) {
                settings_final = settings;
            }

            const set_inner = (): i_data.Settings => {
                runInAction(() =>
                    err(() => {
                        data.settings = settings_final;
                    }, 'cnt_1132'),
                );

                return settings_final;
            };

            return set_inner();
        }, 'cnt_1133');

    public get_unchanged_settings = (): t.AnyRecord =>
        err(
            () => ({
                color_help_is_visible: data.settings.color_help_is_visible,
                last_ip_to_country_csv_char_count: data.settings.last_ip_to_country_csv_char_count,
            }),
            'cnt_1135',
        );
}
