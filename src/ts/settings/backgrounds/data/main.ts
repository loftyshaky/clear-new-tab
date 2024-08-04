import union from 'lodash/union';
import unionBy from 'lodash/unionBy';
import { makeObservable, observable, action, runInAction } from 'mobx';
import { computedFn } from 'mobx-utils';

import { vars, o_schema, d_schema } from '@loftyshaky/shared/shared';
import { s_db, s_i, i_db } from 'shared_clean/internal';

import { d_backgrounds as d_backgrounds_shared } from 'shared/internal';
import { d_backgrounds, d_pagination } from 'settings/internal';

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

    public key = ({ background_id }: { background_id: string | undefined }): string =>
        err(() => (n(background_id) ? background_id : 'drop_zone'), 'cnt_1469');

    public get_dim = ({
        background,
        dim,
    }: {
        background: i_db.Background;
        dim: 'width' | 'height';
    }): number | undefined =>
        err(() => {
            if (background.type === 'color') {
                return undefined;
            }

            return background[`thumbnail_${dim}`];
        }, 'cnt_1461');

    public thumbnail_src = ({
        id,
        background_thumbnail,
    }: {
        id: string;
        background_thumbnail: string;
    }): string =>
        err(() => {
            const fallback: string | undefined = n(
                d_backgrounds.Cache.i().access_prop_of_background_thumbnail_cache_item({
                    background_id: id,
                    key: 'thumbnail',
                }),
            )
                ? d_backgrounds.Cache.i().background_thumbnail_cache_items[id].thumbnail
                : vars.transpaerent_1px_png;

            return n(fallback) && background_thumbnail === '' ? fallback : background_thumbnail;
        }, 'cnt_1446');

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
        placeholder_img = '',
    }: {
        id: string;
        placeholder_img?: string;
    }): Promise<string> =>
        err_async(async () => {
            const background_thumbnail: i_db.BackgroundThumbnail | undefined = n(id)
                ? await s_db.Manipulation.i().get_background_thumbnail({ id })
                : undefined;

            if (n(background_thumbnail) && n(background_thumbnail.background)) {
                d_backgrounds.Cache.i().set_prop_of_background_thumbnail_cache_item({
                    background_id: id,
                    key: 'thumbnail',
                    val: background_thumbnail.background,
                });

                d_backgrounds.Cache.i().set_prop_of_background_thumbnail_cache_item({
                    background_id: id,
                    key: 'loaded_once',
                    val: true,
                });
            }

            return n(background_thumbnail) && n(background_thumbnail.background)
                ? background_thumbnail.background
                : placeholder_img;
        }, 'cnt_1126');

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
    }: {
        backgrounds?: i_db.Background[];
    } = {}): Promise<void> =>
        err_async(async () => {
            const backgrounds_2: i_db.Background[] = n(backgrounds)
                ? backgrounds
                : await s_db.Manipulation.i().get_backgrounds();

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
                }, 'cnt_1128'),
            );

            d_backgrounds_shared.CurrentBackground.i().set_current_background_i({
                backgrounds: backgrounds_2,
            });
        }, 'cnt_1129');

    public merge_backgrounds = ({
        backgrounds,
        sort = false,
    }: {
        backgrounds: i_db.Background[];
        sort?: boolean;
    }): i_db.Background[] =>
        err(() => {
            const merged_backgrounds: i_db.Background[] = union(this.backgrounds, backgrounds);
            const merged_backgrounds_unique_theme_backgrounds: i_db.Background[] = unionBy(
                merged_backgrounds,
                (background: i_db.Background) =>
                    n(background.theme_id) ? background.theme_id : x.unique_id(),
            );

            this.backgrounds = sort
                ? (s_i.Main.i().sort_by_i_ascending({
                      data: merged_backgrounds_unique_theme_backgrounds,
                  }) as i_db.Background[])
                : merged_backgrounds_unique_theme_backgrounds;

            return this.backgrounds;
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

    public get_img_i = ({ i }: { i: number }): number =>
        err(() => d_pagination.Page.i().offset + i + 1, 'cnt_1449');
}
