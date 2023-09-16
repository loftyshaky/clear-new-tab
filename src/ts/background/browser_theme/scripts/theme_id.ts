import _ from 'lodash';
import { Management } from 'webextension-polyfill-ts';

import { s_management } from 'background/internal';

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
            const ext_info: Management.ExtensionInfo[] = await s_management.Main.i().get_all_exts();

            const enabled_themes: Management.ExtensionInfo[] = ext_info.filter(
                (item: Management.ExtensionInfo): boolean =>
                    err(() => item.type === 'theme' && item.enabled, 'cnt_1180'),
            );

            const found_enabled_themes = !_.isEmpty(enabled_themes);

            if (found_enabled_themes) {
                return enabled_themes[0].id;
            }

            return undefined;
        }, 'cnt_1181');

    public check_if_theme_is_local = ({
        theme_id,
    }: {
        theme_id: string | undefined;
    }): Promise<boolean> =>
        err_async(
            async () => {
                if (n(theme_id)) {
                    const theme: Management.ExtensionInfo = await we.management.get(theme_id);
                    const is_local_theme = !n(theme.updateUrl);

                    return is_local_theme;
                }

                return false;
            },
            'cnt_1376',
            { silent: true },
        );
}
