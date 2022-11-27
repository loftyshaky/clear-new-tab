import _ from 'lodash';
import { makeObservable, observable, action, runInAction } from 'mobx';
import { computedFn } from 'mobx-utils';

import { o_schema, d_schema } from '@loftyshaky/shared';
import { s_db, s_i, i_data, i_db } from 'shared/internal';
import { d_backgrounds } from 'settings/internal';

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
                        err(() => background_thumbnail.id === id, 'cnt_1125'),
                ),
            'cnt_1126',
        );

    public get_background_by_id = ({ id }: { id: string }): i_db.Background | undefined =>
        err(
            () =>
                this.backgrounds.find((background: i_db.Background): boolean =>
                    err(() => background.id === id, 'cnt_1125'),
                ),
            'cnt_1427',
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

            backgrounds_2.map((background: i_db.Background): void =>
                err(() => {
                    d_backgrounds.BackgroundAnimation.i().push_already_animated_id({
                        id: background.id,
                    });
                }, 'cnt_1127'),
            );

            runInAction(() =>
                err(() => {
                    this.backgrounds = s_i.Main.i().sort_by_i_ascending({
                        data: backgrounds_2,
                    }) as i_db.Background[];
                    this.background_thumbnails = backgrounds_thumbnails_2;
                }, 'cnt_1128'),
            );

            d_backgrounds.CurrentBackground.i().set_current_background_i();
        }, 'cnt_1129');

    public merge_backgrounds = ({
        backgrounds,
        background_thumbnails,
        sort = false,
    }: {
        backgrounds: i_db.Background[];
        background_thumbnails: i_db.BackgroundThumbnail[];
        sort?: boolean;
    }): void =>
        err(() => {
            const merged_backgrounds: i_db.Background[] = _.union(this.backgrounds, backgrounds);

            this.backgrounds = sort
                ? (s_i.Main.i().sort_by_i_ascending({
                      data: merged_backgrounds,
                  }) as i_db.Background[])
                : merged_backgrounds;
            this.background_thumbnails = _.union(this.background_thumbnails, background_thumbnails);
        }, 'cnt_1130');

    public get_missing_items = ({
        items,
    }: {
        items: (i_db.Background | i_db.BackgroundThumbnail | i_db.BackgroundFile)[];
    }): (i_db.Background | i_db.BackgroundThumbnail | i_db.BackgroundFile)[] =>
        err(() => {
            const ids = this.backgrounds.map((el) => el.id);

            return items.filter((item) => !ids.includes(item.id));
        }, 'cnt_1411');

    public get_missing_backgrounds = ({
        backgrounds,
    }: {
        backgrounds: i_db.Background[];
    }): i_db.Background[] =>
        err(() => this.get_missing_items({ items: backgrounds }) as i_db.Background[], 'cnt_1412');

    public get_missing_background_thumbnails = ({
        background_thumbnails,
    }: {
        background_thumbnails: i_db.BackgroundThumbnail[];
    }): i_db.BackgroundThumbnail[] =>
        err(
            () =>
                this.get_missing_items({
                    items: background_thumbnails,
                }) as i_db.BackgroundThumbnail[],
            'cnt_1413',
        );

    public get_missing_background_files = ({
        background_files,
    }: {
        background_files: i_db.BackgroundFile[];
    }): i_db.BackgroundFile[] =>
        err(
            () => this.get_missing_items({ items: background_files }) as i_db.BackgroundFile[],
            'cnt_1414',
        );

    public transform_background = ({
        background,
    }: {
        background: i_db.Background;
    }): Promise<i_db.Background> =>
        err_async(async () => {
            if (background.type.includes('color')) {
                return background;
            }

            const transform_items: o_schema.TransformItem[] = [
                new o_schema.TransformItem({
                    new_key: 'video_speed',
                    new_val: 'global',
                }),
            ];

            const background_final: i_db.Background = await d_schema.Main.i().transform({
                data: background,
                transform_items,
            });

            return background_final;
        }, 'cnt_1422');
}
