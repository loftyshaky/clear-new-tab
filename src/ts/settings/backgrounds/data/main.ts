import _ from 'lodash';
import { makeObservable, observable, action, runInAction } from 'mobx';
import { computedFn } from 'mobx-utils';

import { s_db, s_i, i_db } from 'shared/internal';

export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

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
        if (data.settings.show_item_developer_info_in_tooltip) {
            return `ID: ${background.id}\nIndex: ${background.i}`;
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
                    this.backgrounds = s_i.Main.i().sort_by_i_ascending({
                        data: backgrounds_2,
                    }) as i_db.Background[];
                    this.background_thumbnails = backgrounds_thumbnails_2;
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
