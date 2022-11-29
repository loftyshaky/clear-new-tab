import _ from 'lodash';
import { Tabs } from 'webextension-polyfill-ts';

import { s_background, i_data } from 'shared/internal';
import { s_service_worker, s_tabs } from 'background/internal';

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

    public clear_slideshow_timer = (): Promise<void> =>
        err_async(async () => {
            const current_tab: Tabs.Tab | undefined = await ext.get_active_tab();

            if (n(current_tab) && n(current_tab.id)) {
                const current_tab_is_new_tab: boolean = s_tabs.TabIds.i().tab_ids.includes(
                    current_tab.id,
                );
                if (!current_tab_is_new_tab) {
                    s_background.BackgroundChange.i().clear_slideshow_timer();
                }
            }
        }, 'cnt_1431');

    public on_new_tab_destroy = ({ tab_id }: { tab_id: number }): Promise<void> =>
        err_async(async () => {
            const settings: i_data.Settings = await ext.storage_get();

            await this.clear_slideshow_timer();

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

            s_service_worker.Lifeline.i().connect();

            const options_page_tab_closed: boolean = tab_id === settings.options_page_tab_id;

            if (options_page_tab_closed) {
                await s_tabs.TabIds.i().update_options_page_tab_id({
                    options_page_tab_id: undefined,
                });
            }
        }, 'cnt_1430');
}

we.tabs.onRemoved.addListener(
    (tab_id: number): Promise<void> =>
        err_async(async () => {
            await Main.i().on_new_tab_destroy({ tab_id });
        }, 'cnt_1037'),
);

we.tabs.onUpdated.addListener(
    (tab_id: number, info: Tabs.OnUpdatedChangeInfoType): Promise<void> =>
        err_async(async () => {
            const typed_query_in_adress_bar: boolean = !n(info.status);

            if (typed_query_in_adress_bar && s_tabs.TabIds.i().main_tab_id === tab_id) {
                await Main.i().on_new_tab_destroy({ tab_id });
            }
        }, 'cnt_1429'),
);
