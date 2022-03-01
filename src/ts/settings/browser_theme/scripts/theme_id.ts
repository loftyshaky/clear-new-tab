import _ from 'lodash';
import { Management } from 'webextension-polyfill-ts';

export class ThemeId {
    private static i0: ThemeId;

    public static i(): ThemeId {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public get_installed = (): Promise<string | undefined> =>
        err_async(async () => {
            const ext_info: Management.ExtensionInfo[] = await ext.send_msg_resp({
                msg: 'get_all_exts',
            });

            const enabled_themes: Management.ExtensionInfo[] = ext_info.filter(
                (item: Management.ExtensionInfo): boolean =>
                    err(() => item.type === 'theme' && item.enabled, 'cnt_65648'),
            );

            // eslint-disable-next-line max-len
            const enabled_themes_but_not_with_id_of_last_installed_theme: Management.ExtensionInfo[] =
                enabled_themes.filter((item: Management.ExtensionInfo): boolean =>
                    err(() => item.id !== data.settings.id_of_last_installed_theme, 'cnt_65368'),
                );

            const found_enabled_themes = !_.isEmpty(enabled_themes);
            const found_enabled_theme_with_last_installed_id = !_.isEmpty(
                enabled_themes_but_not_with_id_of_last_installed_theme,
            );

            if (found_enabled_theme_with_last_installed_id) {
                return enabled_themes_but_not_with_id_of_last_installed_theme[0].id;
            }

            if (found_enabled_themes) {
                return enabled_themes[0].id;
            }

            return undefined;
        }, 'cnt_76555');
}
