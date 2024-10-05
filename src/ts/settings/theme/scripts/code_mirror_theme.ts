import { reaction } from 'mobx';

import { s_custom_code } from 'settings/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public set_up_change_theme_reaction = (): void =>
        err(() => {
            reaction(
                () => data.settings.prefs.options_page_theme,
                (): void =>
                    err(() => {
                        s_custom_code.CodeMirror.change_theme();
                    }, 'cnt_1378'),
            );
        }, 'cnt_1377');
}

export const CodeMirrorTheme = Class.get_instance();
