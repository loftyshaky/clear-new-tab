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
        });
    }

    public backgrounds: i_db.Background[] = [];
    public background_thumbnails: i_db.BackgroundThumbnail[] = [];

    public developer_info = computedFn(function (
        this: Main,
        { background }: { background: i_db.Background },
    ): string | undefined {
        if (data.settings.show_background_id_and_i_in_tooltip) {
            return `id: ${background.id}\nindex: ${background.i}`;
        }

        return undefined;
    });

    public get_background_thumbnail_by_id = ({
        id,
    }: {
        id: string;
    }): i_db.BackgroundThumbnail | undefined =>
        err(
            () =>
                this.background_thumbnails.find(
                    (background_thumbnail: i_db.BackgroundThumbnail): boolean =>
                        err(() => background_thumbnail.id === id, 'cnt_64355'),
                ),
            'cnt_55756',
        );

    public set_backgrounds = ({
        backgrounds,
        background_thumbnails,
    }: {
        backgrounds?: i_db.Background[];
        background_thumbnails?: i_db.BackgroundThumbnail[];
    } = {}): Promise<void> =>
        err_async(async () => {
            const backgrounds_2: i_db.Background[] = n(backgrounds)
                ? backgrounds
                : await s_db.Manipulation.i().get_backgrounds();
            const backgrounds_thumbnails_2: i_db.BackgroundThumbnail[] = n(background_thumbnails)
                ? background_thumbnails
                : await s_db.Manipulation.i().get_background_thumbnails();

            runInAction(() =>
                err(() => {
                    this.backgrounds = backgrounds_2;
                    this.background_thumbnails = backgrounds_thumbnails_2;

                    d_backgrounds.Main.i().backgrounds =
                        d_backgrounds_shared.Main.i().sort_backgrounds({
                            backgrounds: d_backgrounds.Main.i().backgrounds,
                        });
                }, 'cnt_64357'),
            );
        }, 'cnt_49273');

    public merge_backgrounds = ({
        backgrounds,
        background_thumbnails,
    }: {
        backgrounds: i_db.Background[];
        background_thumbnails: i_db.BackgroundThumbnail[];
    }): void =>
        err(() => {
            this.backgrounds = _.union(this.backgrounds, backgrounds);
            this.background_thumbnails = _.union(this.background_thumbnails, background_thumbnails);
        }, 'cnt_49273');
}
