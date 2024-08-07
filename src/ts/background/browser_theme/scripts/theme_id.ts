import isEmpty from 'lodash/isEmpty';
import { Management } from 'webextension-polyfill';

import { s_management } from 'background/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public get_installed = (): Promise<string | undefined> =>
        err_async(async () => {
            const ext_info: Management.ExtensionInfo[] =
                await s_management.Extensions.get_all_exts();

            const enabled_themes: Management.ExtensionInfo[] = ext_info.filter(
                (item: Management.ExtensionInfo): boolean =>
                    err(() => item.type === 'theme' && item.enabled, 'cnt_1180'),
            );

            const found_enabled_themes = !isEmpty(enabled_themes);

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

export const ThemeId = Class.get_instance();
