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

    public added_backgrounds_count: number = -1;

    public get_highest_background_i = ({
        creating_solid_color_background = false,
    }: {
        creating_solid_color_background?: boolean;
    } = {}): number =>
        err(
            () => {
                if (creating_solid_color_background) {
                    this.added_backgrounds_count = 0;
                }
                const background_with_highest_i = _.maxBy(d_backgrounds.Main.i().backgrounds, 'i');

                if (n(background_with_highest_i)) {
                    return background_with_highest_i.i + this.added_backgrounds_count + 1;
                }

                return this.added_backgrounds_count;
            },
            'cnt_43795',
            { silent: true },
        );
}
