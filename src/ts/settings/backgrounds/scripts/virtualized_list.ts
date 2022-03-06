export class VirtualizedList {
    private static i0: VirtualizedList;

    public static i(): VirtualizedList {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public remove_container_tab_index = (): void =>
        err(() => {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const ReactVirtualized__Collection = s<HTMLElement>('.ReactVirtualized__Collection');

            ReactVirtualized__Collection?.setAttribute('tabIndex', '-1');
        }, 'cnt_53665');
}
