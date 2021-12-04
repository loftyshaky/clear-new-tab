import _ from 'lodash';
import { makeObservable, observable, action, runInAction } from 'mobx';
import { computedFn } from 'mobx-utils';

import { i_db } from 'shared/internal';
import { s_backgrounds } from 'settings/internal';

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
            selected_background_i: observable,
            merge_backgrounds: action,
            update_backgrounds: action,
            select: action,
        });
    }

    public backgrounds: i_db.Background[] = [];
    public selected_background_i: number | undefined = undefined;

    selected_cls = computedFn(function (this: Main, { i }: { i: number }): string {
        if (n(this.selected_background_i)) {
            if (i === this.selected_background_i) {
                return 'selected';
            }
        }

        return '';
    });

    public set_backgrounds = (): Promise<void> =>
        err(async () => {
            const backgrounds: i_db.Background[] = await s_backgrounds.Db.i().get_backgrounds();

            runInAction(() =>
                err(() => {
                    this.backgrounds = backgrounds;
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

    public select = ({ background }: { background: i_db.Background }): void =>
        err(() => {
            this.selected_background_i = background.i;
        }, 'cnt_96436');
}
