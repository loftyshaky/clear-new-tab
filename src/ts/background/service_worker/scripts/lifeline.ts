import { Runtime } from 'webextension-polyfill-ts';
import { s_tabs } from 'background/internal';

export class Lifeline {
    private static i0: Lifeline;

    public static i(): Lifeline {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public lifeline: Runtime.Port | undefined;
    public keep_alive_forced_timeout: number = 0;

    public connect = (): void =>
        err(() => {
            const { main_tab_id } = s_tabs.TabIds.i();

            if (n(main_tab_id)) {
                ext.send_msg_to_tab(main_tab_id, { msg: 'connect' });
            }
        }, 'cnt_64565');

    public disconnect = (): void =>
        err(() => {
            const { main_tab_id } = s_tabs.TabIds.i();

            if (n(main_tab_id)) {
                ext.send_msg_to_tab(main_tab_id, { msg: 'disconnect' });
            }
        }, 'cnt_64565');
}
