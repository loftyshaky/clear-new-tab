import { i_virtualized_list } from 'settings/internal';

export class VirtualizedList {
    private static i0: VirtualizedList;

    public static i(): VirtualizedList {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    private react_virtualized_list_selector = '[aria-label="grid"]';

    private generate_full_react_virtualized_list_selector = ({
        virtualized_list_type,
    }: {
        virtualized_list_type: i_virtualized_list.VirtualizedListType;
    }): string =>
        err(() => `.${virtualized_list_type} ${this.react_virtualized_list_selector}`, 'cnt_1302');

    public remove_container_tab_index = ({
        virtualized_list_type,
    }: {
        virtualized_list_type: i_virtualized_list.VirtualizedListType;
    }): void =>
        err(() => {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const ReactVirtualized__Collection = s<HTMLElement>(
                this.generate_full_react_virtualized_list_selector({ virtualized_list_type }),
            );

            ReactVirtualized__Collection?.setAttribute('tabIndex', '-1');
        }, 'cnt_1303');

    public set_bottom_scroll_position = ({
        virtualized_list_type,
    }: {
        virtualized_list_type: i_virtualized_list.VirtualizedListType;
    }): void =>
        err(() => {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const ReactVirtualized__Collection = s<HTMLElement>(
                this.generate_full_react_virtualized_list_selector({ virtualized_list_type }),
            );

            if (n(ReactVirtualized__Collection)) {
                ReactVirtualized__Collection.scrollTop = ReactVirtualized__Collection.scrollHeight;
            }
        }, 'cnt_1304');
}
