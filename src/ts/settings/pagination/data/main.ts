import { db } from 'shared/internal';
import { makeObservable, observable, reaction, runInAction } from 'mobx';

import { d_backgrounds, d_pagination } from 'settings/internal';

export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    private constructor() {
        makeObservable(this, {
            total_backgrounds: observable,
        });
    }

    public total_backgrounds: number = 0;

    public set_total_backgrounds = (): Promise<void> =>
        err_async(async () => {
            const total_backgrounds = await db.backgrounds.count();

            runInAction(() =>
                err(() => {
                    this.total_backgrounds = total_backgrounds;
                }, 'cnt_1441'),
            );
        }, 'cnt_1440');

    public on_backgrounds_reaction = (): void =>
        err(() => {
            reaction(
                () => d_backgrounds.Main.i().backgrounds,
                async () => {
                    await this.set_total_backgrounds();

                    d_pagination.Page.i().set_page_backgrounds();

                    d_backgrounds.Scrollable.i().calculate_height();
                },
                { fireImmediately: true },
            );
        }, 'cnt_1448');
}
