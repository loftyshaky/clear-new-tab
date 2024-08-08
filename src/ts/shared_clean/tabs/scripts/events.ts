import { Tabs } from 'webextension-polyfill';

import { s_tabs } from 'shared_clean/internal';

if (page !== 'offscreen') {
    we.tabs.onRemoved.addListener(
        (tab_id: number): Promise<void> =>
            err_async(async () => {
                const current_tab: Tabs.Tab | undefined = await ext.get_active_tab();
                const closed_current_tab =
                    n(current_tab) && tab_id === s_tabs.TabIds.last_visited_new_tab_id;

                if (closed_current_tab) {
                    await s_tabs.Tabs.on_new_tab_destroy({ tab_id });
                }
            }, 'cnt_1037'),
    );

    we.tabs.onUpdated.addListener(
        (tab_id: number, info: Tabs.OnUpdatedChangeInfoType): Promise<void> =>
            err_async(async () => {
                const typed_query_in_adress_bar_in_current_new_tab: boolean =
                    !n(info.status) && tab_id === s_tabs.TabIds.last_visited_new_tab_id;

                if (typed_query_in_adress_bar_in_current_new_tab) {
                    await s_tabs.Tabs.on_new_tab_destroy({ tab_id });
                }
            }, 'cnt_1429'),
    );

    we.tabs.onActivated.addListener(
        (): Promise<void> =>
            err_async(async () => {
                await s_tabs.TabIds.set_last_visited_new_tab_id();
            }, 'cnt_1471'),
    );
}
