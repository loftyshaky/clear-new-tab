import _ from 'lodash';

import { d_backgrounds } from 'settings/internal';

export class I {
    private static i0: I;

    public static i(): I {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public get_highest_background_i = (): number =>
        err(
            () => {
                let added_backgrounds_count: number = 0;

                const background_with_highest_i = _.maxBy(d_backgrounds.Main.i().backgrounds, 'i');

                if (n(background_with_highest_i)) {
                    added_backgrounds_count += background_with_highest_i.i;
                }

                return added_backgrounds_count;
            },
            'cnt_43795',
            { silent: true },
        );

    public get_next_background_i = (): number =>
        err(
            () => {
                const highest_background_i: number = this.get_highest_background_i();

                if (d_backgrounds.Main.i().backgrounds.length === 0) {
                    return 0;
                }

                return highest_background_i + 1;
            },
            'cnt_43794',
            { silent: true },
        );
}
