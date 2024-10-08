import { makeObservable, observable, action } from 'mobx';
import { computedFn } from 'mobx-utils';

import { i_backgrounds } from 'settings/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {
        makeObservable(this, {
            background_thumbnail_cache_items: observable,
            reset_background_thumbnail_cache: action,
            set_prop_of_background_thumbnail_cache_item: action,
        });
    }

    public background_thumbnail_cache_items: {
        [index: string]: i_backgrounds.BackgroundThumbnailCacheItem;
    } = {};

    public background_fade_in_cls = computedFn(function ({
        background_id,
    }: {
        background_id: string;
    }): string {
        const loaded_once: boolean | undefined =
            (Cache.access_prop_of_background_thumbnail_cache_item({
                background_id,
                key: 'loaded_once',
            }) && Cache.background_thumbnail_cache_items[background_id].loaded_once) as boolean;

        const faded_in_once: boolean | undefined =
            (Cache.access_prop_of_background_thumbnail_cache_item({
                background_id,
                key: 'faded_in_once',
            }) && Cache.background_thumbnail_cache_items[background_id].faded_in_once) as
                | boolean
                | undefined;

        if (loaded_once && faded_in_once) {
            return 'opacity_1';
        }

        if (loaded_once && !faded_in_once) {
            return 'background_fade_in';
        }

        return '';
    });

    public reset_background_thumbnail_cache = (): void =>
        err(() => {
            this.background_thumbnail_cache_items = {};
        }, 'cnt_1450');

    public set_prop_of_background_thumbnail_cache_item = ({
        background_id,
        key,
        val,
    }: {
        background_id: string;
        key: string;
        val: string | boolean;
    }): void =>
        err(() => {
            if (!n(this.background_thumbnail_cache_items[background_id])) {
                this.background_thumbnail_cache_items[background_id] = {};
            }

            if (!n(this.background_thumbnail_cache_items[background_id][key])) {
                this.background_thumbnail_cache_items[background_id][key] = val;
            }
            if (
                this.access_prop_of_background_thumbnail_cache_item({
                    background_id,
                    key: 'loaded_once',
                })
            ) {
                setTimeout(() => {
                    this.set_prop_of_background_thumbnail_cache_item({
                        background_id,
                        key: 'faded_in_once',
                        val: true,
                    });
                }, data.settings.prefs.transition_duration);
            }
        }, 'cnt_1451');

    public access_prop_of_background_thumbnail_cache_item = ({
        background_id,
        key,
    }: {
        background_id: string;
        key: string;
    }): string | boolean | undefined =>
        err(
            () =>
                n(Cache.background_thumbnail_cache_items[background_id]) &&
                n(Cache.background_thumbnail_cache_items[background_id][key])
                    ? Cache.background_thumbnail_cache_items[background_id][key]
                    : undefined,
            'cnt_1453',
        );
}

export const Cache = Class.get_instance();
