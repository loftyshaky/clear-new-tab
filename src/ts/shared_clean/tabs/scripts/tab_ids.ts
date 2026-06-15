import type { Tabs } from 'webextension-polyfill';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {}

    public main_tab_id: number | undefined;
    public last_visited_new_tab_id: number | undefined;
    public tab_ids: number[] = []; // other than main

    public push_tab_id = ({
        active_tab,
    }: {
        active_tab?: Tabs.Tab;
    } = {}): Promise<void> =>
        err_async(async () => {
            const active_tab_final: Tabs.Tab | undefined = n(active_tab)
                ? active_tab
                : await ext.get_active_tab();

            if (n(active_tab_final) && n(active_tab_final.id)) {
                const active_tab_id_already_pushed = n(this.main_tab_id);

                if (!active_tab_id_already_pushed) {
                    this.main_tab_id = active_tab_final.id;
                }

                const tab_id_already_pushed: boolean = this.tab_ids.some(
                    (tab_id: number): boolean =>
                        err(() => tab_id === active_tab_final.id, 'cnt_1038'),
                );

                if (!tab_id_already_pushed) {
                    const active_tab_id_eqals_slideshow_timer_new_tab_page_tab_id =
                        active_tab_final.id === this.main_tab_id;

                    if (!active_tab_id_eqals_slideshow_timer_new_tab_page_tab_id) {
                        this.tab_ids.push(active_tab_final.id);
                    }
                }
            }
        }, 'cnt_1039');

    public set_last_visited_new_tab_id = ({
        active_tab,
        called_from_new_tab_init = false,
    }: {
        called_from_new_tab_init?: boolean;
        active_tab?: Tabs.Tab;
    } = {}): Promise<void> =>
        err_async(async () => {
            const active_tab_final: Tabs.Tab | undefined = n(active_tab)
                ? active_tab
                : await ext.get_active_tab();

            if (n(active_tab_final) && n(active_tab_final.id)) {
                const response = called_from_new_tab_init
                    ? true
                    : await ext.send_msg_to_tab_resp(active_tab_final.id, {
                          msg: 'confirm_this_tab_is_new_tab_or_settings_page',
                      });
                const this_tab_is_new_tab_or_settings_page: boolean =
                    typeof response === 'boolean' ? response : false;

                if (this_tab_is_new_tab_or_settings_page) {
                    this.last_visited_new_tab_id = active_tab_final.id;
                }
            }
        }, 'cnt_1432');
}

export const TabIds = Class.get_instance();
