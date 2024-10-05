import { makeObservable, action } from 'mobx';
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

    private hide = (): Promise<void> =>
        err_async(async () => {
            data.settings.prefs.install_help_is_visible = false;

            await d_data.Manipulation.send_msg_to_update_settings({
                settings: data.settings,
                load_settings: true,
                update_instantly: true,
            });
        }, 'cnt_1222');

    public bind_hide = (): void =>
        err(() => {
            const hide_install_help_el = s<HTMLButtonElement>('.hide_install_help');

            if (n(hide_install_help_el)) {
                x.bind(hide_install_help_el, 'click', this.hide);
            }
        }, 'cnt_1223');
}

export const Visibility = Class.get_instance();
