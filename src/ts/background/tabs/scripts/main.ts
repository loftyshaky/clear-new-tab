import _ from 'lodash';
import { Tabs } from 'webextension-polyfill-ts';

import { s_background, i_data } from 'shared/internal';
import { s_service_worker, s_tabs } from 'background/internal';

we.tabs.onRemoved.addListener(
    (tab_id: number): Promise<void> =>
        err_async(async () => {
            const settings: i_data.Settings = await ext.storage_get();
            const current_tab: Tabs.Tab | undefined = await ext.get_active_tab();

            if (n(current_tab) && n(current_tab.id)) {
                const current_tab_is_new_tab: boolean = s_tabs.TabIds.i().tab_ids.includes(
                    current_tab.id,
                );
                if (!current_tab_is_new_tab) {
                    s_background.BackgroundChange.i().clear_slideshow_timer();
                }
            }

            const remove_id = ({ id_to_remove }: { id_to_remove: number }): void =>
                err(() => {
                    _.remove(
                        s_tabs.TabIds.i().tab_ids,
                        (tab_id_2: number) => tab_id_2 === id_to_remove,
                    );
                }, 'cnt_1036');

            if (s_tabs.TabIds.i().main_tab_id === tab_id) {
                if (s_tabs.TabIds.i().tab_ids.length === 0) {
                    s_tabs.TabIds.i().main_tab_id = undefined;
                } else {
                    const slideshow_timer_new_tab_page_tab_id = s_tabs.TabIds.i().tab_ids[0];
                    // eslint-disable-next-line prefer-destructuring
                    s_tabs.TabIds.i().main_tab_id = slideshow_timer_new_tab_page_tab_id;

                    remove_id({
                        id_to_remove: slideshow_timer_new_tab_page_tab_id,
                    });
                }
            }

            remove_id({ id_to_remove: tab_id });

            s_service_worker.Lifeline.i().connect();

            const options_page_tab_closed: boolean = tab_id === settings.options_page_tab_id;

            if (options_page_tab_closed) {
                await s_tabs.TabIds.i().update_options_page_tab_id({
                    options_page_tab_id: undefined,
                });
            }
        }, 'cnt_1037'),
);
