import { Management } from 'webextension-polyfill-ts';

export class ThemeId {
    private static i0: ThemeId;

    public static i(): ThemeId {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public check_if_theme_is_local = ({
        theme_id,
    }: {
        theme_id: string | undefined;
    }): Promise<boolean> =>
        err_async(async () => {
            if (n(theme_id)) {
                const theme: Management.ExtensionInfo = await we.management.get(theme_id);
                const is_local_theme = !n(theme.updateUrl);

                return is_local_theme;
            }

            return false;
        }, 'cnt_1376');
}
