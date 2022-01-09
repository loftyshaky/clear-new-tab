import { BigNumber } from 'bignumber.js';

import { d_backgrounds } from 'settings/internal';

export class I {
    private static i0: I;

    public static i(): I {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public get_last_background_i = (): string =>
        err(
            () => {
                let added_backgrounds_count: string = '0';

                const last_background_i: string =
                    d_backgrounds.Main.i().backgrounds[
                        d_backgrounds.Main.i().backgrounds.length - 1
                    ].i;

                if (n(last_background_i)) {
                    added_backgrounds_count = BigNumber(last_background_i)
                        .plus(added_backgrounds_count)
                        .toString();
                }

                return added_backgrounds_count;
            },
            'cnt_43795',
            { silent: true },
        );

    public get_next_background_i = (): string =>
        err(
            () => {
                const highest_background_i: string = this.get_last_background_i();

                if (d_backgrounds.Main.i().backgrounds.length === 0) {
                    return '0';
                }

                return new BigNumber(highest_background_i).plus(1).toString();
            },
            'cnt_43794',
            { silent: true },
        );
}
