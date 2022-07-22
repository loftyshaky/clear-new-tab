import { reaction } from 'mobx';

import { s_custom_code } from 'settings/internal';

export class CodeMirrorTheme {
    private static i0: CodeMirrorTheme;

    public static i(): CodeMirrorTheme {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public set_up_change_theme_reaction = (): void =>
        err(() => {
            reaction(
                () => data.settings.options_page_theme,
                (): void =>
                    err(() => {
                        s_custom_code.CodeMirror.i().change_theme();
                    }, 'cnt_1378'),
            );
        }, 'cnt_1377');
}
