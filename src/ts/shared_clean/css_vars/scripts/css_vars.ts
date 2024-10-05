import { s_css_vars } from '@loftyshaky/shared/shared_clean';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public set = (): void =>
        err(() => {
            const roots = ['announcement', 'dependencies', 'settings', 'new_tab'].includes(page)
                ? [document.documentElement]
                : [];

            s_css_vars.CssVars.set_transition_vars({
                roots,
                transition_duration: data.settings.prefs.transition_duration,
            });

            s_css_vars.CssVars.set_var({
                roots,
                name: 'fade_in',
                val: `fade_in ${data.settings.prefs.transition_duration}ms ease-out forwards`,
            });

            s_css_vars.CssVars.set_var({
                roots,
                name: 'fade_out',
                val: `fade_out ${data.settings.prefs.transition_duration}ms ease-out forwards`,
            });
        }, 'cnt_1317');
}

export const CssVars = Class.get_instance();
