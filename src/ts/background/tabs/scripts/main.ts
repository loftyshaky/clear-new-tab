import { s_tabs } from 'background/internal';

we.tabs.onRemoved.addListener(
    (tab_id: number): Promise<void> =>
        err_async(async () => {
            const options_page_tab_closed: boolean =
                tab_id === s_tabs.TabIds.i().options_page_tab_id;

            if (options_page_tab_closed) {
                s_tabs.TabIds.i().options_page_tab_id = undefined;
            }
        }, 'cnt_64254'),
);
