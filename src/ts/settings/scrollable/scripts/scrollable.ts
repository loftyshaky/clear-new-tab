import { i_scrollable } from 'settings/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public auto_scroll_enabled: boolean = true;

    private generate_full_react_scrollable_selector = ({
        scrollable_type,
    }: {
        scrollable_type: i_scrollable.ScrollableType;
    }): string => err(() => `.${scrollable_type} .scrollable`, 'cnt_1302');

    public set_scroll_position = ({
        scrollable_type,
        position = 'bottom',
    }: {
        scrollable_type: i_scrollable.ScrollableType;
        position?: i_scrollable.Position;
    }): void =>
        err(() => {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const scrollable = s<HTMLElement>(
                this.generate_full_react_scrollable_selector({ scrollable_type }),
            );

            if (this.auto_scroll_enabled && n(scrollable)) {
                scrollable.scrollTop = position === 'top' ? 0 : scrollable.scrollHeight;
            }

            this.auto_scroll_enabled = true;
        }, 'cnt_1304');
}

export const Scrollable = Class.get_instance();
