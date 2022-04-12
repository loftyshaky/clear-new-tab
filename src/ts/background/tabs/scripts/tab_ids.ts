import { Tabs } from 'webextension-polyfill-ts';

export class TabIds {
    private static i0: TabIds;

    public static i(): TabIds {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public options_page_tab_id: number | undefined;

    public push_options_page_tab_id = (): Promise<void> =>
        err_async(async () => {
            const active_tab: Tabs.Tab | undefined = await ext.get_active_tab();

            if (n(active_tab) && n(active_tab.id)) {
                const active_tab_id_already_pushed = n(this.options_page_tab_id);

                if (!active_tab_id_already_pushed) {
                    this.options_page_tab_id = active_tab.id;
                }
            }
        }, 'cnt_72145');
}
