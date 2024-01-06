import { i_scrollable } from 'settings/internal';

export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

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

            if (n(scrollable)) {
                scrollable.scrollTop = position === 'top' ? 0 : scrollable.scrollHeight;
            }
        }, 'cnt_1304');
}
