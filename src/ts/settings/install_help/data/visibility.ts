import { action, makeObservable } from 'mobx';
import { type MouseEvent } from 'react';

import { d_data } from 'shared_clean/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {
        makeObservable<this, 'hide'>(this, {
            hide: action,
        });
    }

    public hide = (e: MouseEvent): Promise<void> =>
        err_async(async () => {
            const is_hide_install_help_btn =
                e.target instanceof HTMLElement && x.matches(e.target, '.hide_install_help');

            if (is_hide_install_help_btn) {
                data.settings.prefs.install_help_is_visible = false;

                await d_data.Manipulation.send_msg_to_update_settings({
                    settings: data.settings,
                    load_settings: true,
                    update_instantly: true,
                });
            }
        }, 'cnt_1222');
}

export const Visibility = Class.get_instance();
