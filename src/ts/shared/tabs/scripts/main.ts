import _ from 'lodash';
import { Tabs } from 'webextension-polyfill-ts';

import { s_background, s_tabs } from 'shared/internal';

export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    private remove_id = ({ id_to_remove }: { id_to_remove: number }): void =>
        err(() => {
            _.remove(s_tabs.TabIds.i().tab_ids, (tab_id_2: number) => tab_id_2 === id_to_remove);
        }, 'cnt_1036');

    public on_new_tab_destroy = ({ tab_id }: { tab_id: number }): Promise<void> =>
        err_async(async () => {
            s_background.BackgroundChange.i().clear_slideshow_timer();

            if (s_tabs.TabIds.i().main_tab_id === tab_id) {
                if (s_tabs.TabIds.i().tab_ids.length === 0) {
                    s_tabs.TabIds.i().main_tab_id = undefined;
                } else {
                    const slideshow_timer_new_tab_page_tab_id = s_tabs.TabIds.i().tab_ids[0];
                    // eslint-disable-next-line prefer-destructuring
                    s_tabs.TabIds.i().main_tab_id = slideshow_timer_new_tab_page_tab_id;

                    this.remove_id({
                        id_to_remove: slideshow_timer_new_tab_page_tab_id,
                    });
                }
            }

            this.remove_id({ id_to_remove: tab_id });
        }, 'cnt_1430');
}

if (page !== 'offscreen') {
    we.tabs.onRemoved.addListener(
        (tab_id: number): Promise<void> =>
            err_async(async () => {
                const current_tab: Tabs.Tab | undefined = await ext.get_active_tab();
                const closed_current_tab =
                    n(current_tab) && tab_id === s_tabs.TabIds.i().last_visited_new_tab_id;

                if (closed_current_tab) {
                    await Main.i().on_new_tab_destroy({ tab_id });
                }
            }, 'cnt_1037'),
    );

    we.tabs.onUpdated.addListener(
        (tab_id: number, info: Tabs.OnUpdatedChangeInfoType): Promise<void> =>
            err_async(async () => {
                const typed_query_in_adress_bar_in_current_new_tab: boolean =
                    !n(info.status) && tab_id === s_tabs.TabIds.i().last_visited_new_tab_id;

                if (typed_query_in_adress_bar_in_current_new_tab) {
                    await Main.i().on_new_tab_destroy({ tab_id });
                }
            }, 'cnt_1429'),
    );

    we.tabs.onActivated.addListener(
        (): Promise<void> =>
            err_async(async () => {
                await s_tabs.TabIds.i().set_last_visited_new_tab_id();
            }, 'cnt_1471'),
    );
}
