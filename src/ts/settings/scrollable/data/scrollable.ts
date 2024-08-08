import { makeObservable, observable, action } from 'mobx';

import { s_scrollable, i_scrollable } from 'settings/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {
        makeObservable(this, {
            scroll_backgrounds_scrollable_to_top: observable,
            scroll_backgrounds_scrollable_to_bottom: observable,
            scroll_tasks_scrollable_to_bottom: observable,
            set_scroll_backgrounds_scrollable_to_top_bool: action,
            set_scroll_backgrounds_scrollable_to_bottom_bool: action,
            set_scroll_tasks_scrollable_to_bottom_bool: action,
        });
    }

    public scroll_backgrounds_scrollable_to_top: boolean = false;
    public scroll_backgrounds_scrollable_to_bottom: boolean = false;
    public scroll_tasks_scrollable_to_bottom: boolean = false;

    public set_scroll_backgrounds_scrollable_to_top_bool = ({ bool }: { bool: boolean }): void =>
        err(() => {
            this.scroll_backgrounds_scrollable_to_top = bool;
        }, 'cnt_1456');

    public set_scroll_backgrounds_scrollable_to_bottom_bool = ({ bool }: { bool: boolean }): void =>
        err(() => {
            this.scroll_backgrounds_scrollable_to_bottom = bool;
        }, 'cnt_1454');

    public set_scroll_tasks_scrollable_to_bottom_bool = ({ bool }: { bool: boolean }): void =>
        err(() => {
            this.scroll_tasks_scrollable_to_bottom = bool;
        }, 'cnt_1462');

    public set_scroll_position = ({
        scrollable_type,
        position = 'bottom',
    }: {
        scrollable_type: 'backgrounds' | 'tasks';
        position: i_scrollable.Position;
    }): void =>
        err(() => {
            const is_backgrounds_scrollable_type = scrollable_type === 'backgrounds';
            if (
                is_backgrounds_scrollable_type
                    ? this[`scroll_${scrollable_type}_scrollable_to_${position}`]
                    : this[`scroll_${scrollable_type}_scrollable_to_bottom`]
            ) {
                s_scrollable.Scrollable.set_scroll_position({
                    scrollable_type,
                    position,
                });

                if (is_backgrounds_scrollable_type) {
                    this[`set_scroll_${scrollable_type}_scrollable_to_${position}_bool`]({
                        bool: false,
                    });
                } else {
                    this[`set_scroll_${scrollable_type}_scrollable_to_bottom_bool`]({
                        bool: false,
                    });
                }
            }
        }, 'cnt_1455');
}

export const Scrollable = Class.get_instance();
