import { BigNumber } from 'bignumber.js';

import { i_db } from 'shared/internal';

export class I {
    private static i0: I;

    public static i(): I {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    private get_last_i = ({ items }: { items: i_db.Background[] | i_db.Task[] }): string =>
        err(
            () => {
                let added_items_count: string = '0';
                const at_least_one_item_exists: boolean = items.length !== 0;

                if (at_least_one_item_exists) {
                    const last_i: string = items[items.length - 1].i;

                    if (n(last_i)) {
                        added_items_count = BigNumber(last_i).plus(added_items_count).toString();
                    }
                }

                return added_items_count;
            },
            'cnt_1219',
            { silent: true },
        );

    public get_next_i = ({ items }: { items: i_db.Background[] | i_db.Task[] }): string =>
        err(
            () => {
                const highest_i: string = this.get_last_i({ items });

                if (items.length === 0) {
                    return '0';
                }

                return new BigNumber(highest_i).plus(1).toString();
            },
            'cnt_1220',
            { silent: true },
        );
}
