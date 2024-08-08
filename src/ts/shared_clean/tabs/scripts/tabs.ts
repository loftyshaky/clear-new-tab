import remove from 'lodash/remove';

import { s_background, s_tabs } from 'shared_clean/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    private remove_id = ({ id_to_remove }: { id_to_remove: number }): void =>
        err(() => {
            remove(s_tabs.TabIds.tab_ids, (tab_id_2: number) => tab_id_2 === id_to_remove);
        }, 'cnt_1036');

    public on_new_tab_destroy = ({ tab_id }: { tab_id: number }): Promise<void> =>
        err_async(async () => {
            s_background.BackgroundChange.clear_slideshow_timer();

            if (s_tabs.TabIds.main_tab_id === tab_id) {
                if (s_tabs.TabIds.tab_ids.length === 0) {
                    s_tabs.TabIds.main_tab_id = undefined;
                } else {
                    const slideshow_timer_new_tab_page_tab_id = s_tabs.TabIds.tab_ids[0];
                    // eslint-disable-next-line prefer-destructuring
                    s_tabs.TabIds.main_tab_id = slideshow_timer_new_tab_page_tab_id;

                    this.remove_id({
                        id_to_remove: slideshow_timer_new_tab_page_tab_id,
                    });
                }
            }

            this.remove_id({ id_to_remove: tab_id });
        }, 'cnt_1430');
}

export const Tabs = Class.get_instance();
