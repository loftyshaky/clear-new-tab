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

    public sort_backgrounds = ({ backgrounds }: { backgrounds: i_db.Background[] }): void =>
        err(() => {
            backgrounds.sort((a: i_db.Background, b: i_db.Background): number =>
                err(() => new BigNumber(a.i).minus(b.i).toString(), 'cnt_64367'),
            );
        }, 'cnt_64436');
}
