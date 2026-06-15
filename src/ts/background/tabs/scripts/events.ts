import type { Tabs } from 'webextension-polyfill';

import { s_links } from '@loftyshaky/shared/shared_clean';
import { s_home_btn } from 'background/internal';
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
                    !n(info.status) &&
                    !n(info.audible) &&
                    tab_id === s_tabs.TabIds.last_visited_new_tab_id; // !n(info.audible) Prevents bug with video background with non 0 volume not changing in multiple_backgrounds slideshow mode.

                if (typed_query_in_adress_bar_in_current_new_tab) {
                    await s_tabs.Tabs.on_new_tab_destroy({ tab_id });
                }

                if (env.browser === 'opera') {
                    const current_tab: Tabs.Tab | undefined = await ext.get_active_tab();

                    if (
                        n(current_tab) &&
                        current_tab.url === s_links.Browser.new_tab[env.browser]
                    ) {
                        if (s_home_btn.HomeBtn.opening_default_new_tab_page === 0) {
                            void we.tabs.update({
                                url: 'chrome-extension://nnmhbhoglljdlhbllfgkemgenlplalie/new_tab.html',
                            });
                        } else {
                            s_home_btn.HomeBtn.opening_default_new_tab_page -= 1;
                        }
                    }
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
