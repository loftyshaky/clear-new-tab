import { makeObservable, observable, action } from 'mobx';

import { s_virtualized_list, i_virtualized_list } from 'settings/internal';

export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    private constructor() {
        makeObservable(this, {
            scroll_backgrounds_virtualized_list_to_top: observable,
            scroll_backgrounds_virtualized_list_to_bottom: observable,
            set_scroll_scroll_backgrounds_virtualized_list_to_top_bool: action,
            set_scroll_scroll_backgrounds_virtualized_list_to_bottom_bool: action,
        });
    }

    public scroll_backgrounds_virtualized_list_to_top: boolean = false;
    public scroll_backgrounds_virtualized_list_to_bottom: boolean = false;

    public set_scroll_scroll_backgrounds_virtualized_list_to_top_bool = ({
        bool,
    }: {
        bool: boolean;
    }): void =>
        err(() => {
            this.scroll_backgrounds_virtualized_list_to_top = bool;
        }, 'cnt_1456');

    public set_scroll_scroll_backgrounds_virtualized_list_to_bottom_bool = ({
        bool,
    }: {
        bool: boolean;
    }): void =>
        err(() => {
            this.scroll_backgrounds_virtualized_list_to_bottom = bool;
        }, 'cnt_1454');

    public set_backgrounds_scroll_position = ({
        position = 'bottom',
    }: {
        position: i_virtualized_list.Position;
    }): void =>
        err(() => {
            if (this[`scroll_backgrounds_virtualized_list_to_${position}`]) {
                s_virtualized_list.Main.i().set_scroll_position({
                    virtualized_list_type: 'backgrounds',
                    position,
                });

                this[`set_scroll_scroll_backgrounds_virtualized_list_to_${position}_bool`]({
                    bool: false,
                });
            }
        }, 'cnt_1455');
}
