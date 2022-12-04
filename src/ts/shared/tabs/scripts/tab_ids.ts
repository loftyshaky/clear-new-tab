import { Tabs } from 'webextension-polyfill-ts';

import { s_service_worker } from 'shared/internal';

export class TabIds {
    private static i0: TabIds;

    public static i(): TabIds {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}
    public main_tab_id: number | undefined;
    public last_visited_new_tab_id: number | undefined;
    public tab_ids: number[] = []; // other than main

    public push_tab_id = (): Promise<void> =>
        err_async(async () => {
            const active_tab: Tabs.Tab | undefined = await ext.get_active_tab();

            if (n(active_tab) && n(active_tab.id)) {
                const active_tab_id_already_pushed = n(this.main_tab_id);

                if (!active_tab_id_already_pushed) {
                    this.main_tab_id = active_tab.id;
                }

                const tab_id_already_pushed: boolean = this.tab_ids.some(
                    (tab_id: number): boolean => err(() => tab_id === active_tab.id, 'cnt_1038'),
                );

                if (!tab_id_already_pushed) {
                    const active_tab_id_eqals_slideshow_timer_new_tab_page_tab_id =
                        active_tab.id === this.main_tab_id;

                    if (!active_tab_id_eqals_slideshow_timer_new_tab_page_tab_id) {
                        this.tab_ids.push(active_tab.id);
                    }
                }
            }

            s_service_worker.Lifeline.i().connect();
        }, 'cnt_1039');

    public set_last_visited_new_tab_id = (): Promise<void> =>
        err_async(async () => {
            const active_tab: Tabs.Tab | undefined = await ext.get_active_tab();

            if (n(active_tab) && n(active_tab.id)) {
                this.last_visited_new_tab_id = active_tab.id;
            }
        }, 'cnt_1432');
}
