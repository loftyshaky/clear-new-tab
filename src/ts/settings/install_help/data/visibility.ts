import { makeObservable, action } from 'mobx';

export class Visibility {
    private static i0: Visibility;

    public static i(): Visibility {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    private constructor() {
        makeObservable<this, 'hide'>(this, {
            hide: action,
        });
    }

    private hide = (): Promise<void> =>
        err_async(async () => {
            data.settings.install_help_is_visible = false;

            await ext.send_msg_resp({
                msg: 'update_settings_background',
                settings: data.settings,
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
