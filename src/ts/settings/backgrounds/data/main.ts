import _ from 'lodash';
import { makeObservable, observable, action, runInAction } from 'mobx';

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
            merge_backgrounds: action,
            update_backgrounds: action,
        });
    }

    public backgrounds: i_db.Background[] = [];

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
}
