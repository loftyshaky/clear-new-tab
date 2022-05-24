import { i_db } from 'shared/internal';

import { BigNumber } from 'bignumber.js';

export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public sort_by_i_ascending = ({
        data,
    }: {
        data: i_db.Background[] | i_db.Task[];
    }): i_db.Background[] | i_db.Task[] =>
        err(
            () =>
                data.sort(
                    (a: i_db.Background | i_db.Task, b: i_db.Background | i_db.Task): number =>
                        err(() => new BigNumber(a.i).minus(b.i).toString(), 'cnt_1346'),
                ),
            'cnt_1347',
        );

    public find_i_of_item_with_id = ({
        id,
        items,
    }: {
        id: number | string;
        items: i_db.Background[] | i_db.Task[];
    }): number =>
        err(
            () =>
                items.findIndex((item: i_db.Background | i_db.Task): boolean =>
                    err(() => item.id === id, 'cnt_1348'),
                ),
            'cnt_1349',
        );
}
