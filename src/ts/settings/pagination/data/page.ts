import _ from 'lodash';
import { makeObservable, observable, autorun, reaction, action } from 'mobx';

import { i_db } from 'shared/internal';
import { d_backgrounds, d_pagination, d_virtualized_list } from 'settings/internal';

export class Page {
    private static i0: Page;

    public static i(): Page {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    private constructor() {
        makeObservable(this, {
            page: observable,
            page_backgrounds: observable,
            backgrounds_per_page: observable,
            change: action,
            set_last: action,
            set_page_backgrounds: action,
            set_backgrounds_per_page_val: action,
        });
    }

    public page: number = 1;
    public offset: number = 0;
    public backgrounds_per_page: number = 0;
    public backgrounds_per_page_min_val: number = 1;
    public backgrounds_per_page_max_val: number = 10000000;
    public page_backgrounds: i_db.Background[] = [];

    public change = (page: number): void =>
        err(() => {
            this.page = page;

            d_virtualized_list.Main.i().set_scroll_scroll_backgrounds_virtualized_list_to_top_bool({
                bool: true,
            });
        }, 'cnt_1442');

    public set_last = (): void =>
        err(() => {
            this.page = Math.ceil(
                d_pagination.Main.i().total_backgrounds / this.backgrounds_per_page,
            );

            // eslint-disable-next-line max-len
            d_virtualized_list.Main.i().set_scroll_scroll_backgrounds_virtualized_list_to_bottom_bool(
                { bool: true },
            );
        }, 'cnt_1443');

    public set_last_if_page_empty = (): void =>
        err(() => {
            if (this.page_backgrounds.length === 0) {
                this.set_last();
            }
        }, 'cnt_1443');

    public set_backgrounds_per_page_val = (): void =>
        err(() => {
            if (data.settings.backgrounds_per_page < this.backgrounds_per_page_min_val) {
                this.backgrounds_per_page = this.backgrounds_per_page_min_val;
            } else if (data.settings.backgrounds_per_page > this.backgrounds_per_page_max_val) {
                this.backgrounds_per_page = this.backgrounds_per_page_max_val;
            } else {
                this.backgrounds_per_page = data.settings.backgrounds_per_page;
            }

            this.set_last();

            d_backgrounds.VirtualizedList.i().calculate_height();
        }, 'cnt_1459');

    private set_backgrounds_per_page_val_debounce = _.debounce(
        this.set_backgrounds_per_page_val,
        500,
    );

    public set_page_backgrounds = (): void =>
        err(() => {
            this.offset = (this.page - 1) * this.backgrounds_per_page;
            const limit: number = this.offset + this.backgrounds_per_page;

            this.page_backgrounds = d_backgrounds.Main.i().backgrounds.slice(this.offset, limit);
        }, 'cnt_1447');

    public on_page_reaction = (): void =>
        err(() => {
            reaction(
                () => this.page,
                () => {
                    d_backgrounds.Cache.i().reset_background_thumbnail_cache();
                    Page.i().set_page_backgrounds();
                },
            );
        }, 'cnt_1448');

    public on_page_backgrounds_autorun = (): void =>
        err(() => {
            autorun(() => {
                if (d_pagination.Page.i().page_backgrounds.length === 0) {
                    d_pagination.Page.i().set_last();
                }
            });
        }, 'cnt_1448');

    public on_backgrounds_per_page_reaction = (): void =>
        err(() => {
            reaction(
                () => data.settings.backgrounds_per_page,
                this.set_backgrounds_per_page_val_debounce,
            );
        }, 'cnt_1457');
}
