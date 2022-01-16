import _ from 'lodash';
import { makeObservable, observable, action, runInAction } from 'mobx';
import { computedFn } from 'mobx-utils';

import { d_backgrounds as d_backgrounds_shared, s_db, i_db } from 'shared/internal';
import { d_backgrounds } from 'settings/internal';

export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {
        makeObservable(this, {
            backgrounds: observable,
            merge_backgrounds: action,
            update_backgrounds: action,
        });
    }

    public backgrounds: i_db.Background[] = [];

    public developer_info = computedFn(function (
        this: Main,
        { background }: { background: i_db.Background },
    ): string | undefined {
        if (data.settings.show_background_id_and_i_in_tooltip) {
            return `id: ${background.id}\nindex: ${background.i}`;
        }

        return undefined;
    });

    public set_backgrounds = ({
        backgrounds,
    }: {
        backgrounds?: i_db.Background[];
    } = {}): Promise<void> =>
        err(async () => {
            const backgrounds_2: i_db.Background[] = n(backgrounds)
                ? backgrounds
                : await s_db.Manipulation.i().get_backgrounds();

            runInAction(() =>
                err(() => {
                    this.backgrounds = backgrounds_2;

                    d_backgrounds_shared.Main.i().sort_backgrounds({
                        backgrounds: d_backgrounds.Main.i().backgrounds,
                    });
                }, 'cnt_64357'),
            );
        }, 'cnt_49273');

    public merge_backgrounds = ({ backgrounds }: { backgrounds: i_db.Background[] }): void =>
        err(() => {
            this.backgrounds = _.union(this.backgrounds, backgrounds);
        }, 'cnt_49273');

    public update_backgrounds = ({ backgrounds }: { backgrounds: i_db.Background[] }): void =>
        err(() => {
            this.backgrounds = _.union(this.backgrounds, backgrounds);
        }, 'cnt_49273');
}
