import _ from 'lodash';
import { makeObservable, observable, action } from 'mobx';

import { i_db } from 'shared/internal';

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
            merge_backgrounds_data: action,
            update_backgrounds_data: action,
        });
    }

    public backgrounds: i_db.Background[] = [];

    public merge_backgrounds_data = ({ backgrounds }: { backgrounds: i_db.Background[] }): void =>
        err(() => {
            this.backgrounds = _.union(this.backgrounds, backgrounds);
        }, 'cnt_49273');

    public update_backgrounds_data = ({ backgrounds }: { backgrounds: i_db.Background[] }): void =>
        err(() => {
            this.backgrounds = _.union(this.backgrounds, backgrounds);
        }, 'cnt_49273');
}
