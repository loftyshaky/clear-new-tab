import _ from 'lodash';

import { s_service_worker, s_tabs } from 'background/internal';

we.tabs.onRemoved.addListener((tab_id: number): void =>
    err(() => {
        const remove_id = ({ id_to_remove }: { id_to_remove: number }): void =>
            err(() => {
                _.remove(
                    s_tabs.TabIds.i().tab_ids,
                    (tab_id_2: number) => tab_id_2 === id_to_remove,
                );
            }, 'cnt_66556');

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
    }, 'cnt_64254'),
);
