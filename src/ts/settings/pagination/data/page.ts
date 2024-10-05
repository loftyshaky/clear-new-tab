import debounce from 'lodash/debounce';
import { makeObservable, observable, computed, autorun, reaction, action, runInAction } from 'mobx';

import { i_db } from 'shared_clean/internal';
import { d_backgrounds, d_pagination, d_scrollable, d_sections } from 'settings/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {
        makeObservable(this, {
            page: observable,
            page_backgrounds: observable,
            backgrounds_per_page: observable,
            there_are_backgrounds_for_more_than_one_page: computed,
            pagination_visibility_cls: computed,
            change: action,
            set_last: action,
            set_page_backgrounds: action,
        });
    }

    public page: number = 1;
    public offset: number = 0;
    public backgrounds_per_page: number = 0;
    public backgrounds_per_page_min_val: number = 1;
    public backgrounds_per_page_max_val: number = 10000000;
    public page_backgrounds: i_db.Background[] = [];

    public get there_are_backgrounds_for_more_than_one_page() {
        return d_pagination.Pagination.pagination_btns.length > 5;
    }

    public get pagination_visibility_cls() {
        return this.there_are_backgrounds_for_more_than_one_page &&
            d_backgrounds.Backgrounds.backgrounds.length > d_pagination.Page.backgrounds_per_page &&
            d_backgrounds.Scrollable.pagination_height !== 0
            ? ''
            : 'visibility_hidden';
    }

    public page_is_active_cls = ({ is_active }: { is_active: boolean }): string =>
        err(() => (is_active ? 'active' : ''), 'cnt_1463');

    public page_is_disabled_cls = ({ is_disabled }: { is_disabled: boolean }): string =>
        err(() => (is_disabled ? 'disabled' : ''), 'cnt_1464');

    public change = ({ page }: { page: number }): void =>
        err(() => {
            this.page = page;

            d_scrollable.Scrollable.set_scroll_backgrounds_scrollable_to_top_bool({
                bool: true,
            });
        }, 'cnt_1442');

    public set_last = (): Promise<void> =>
        err_async(async () => {
            await d_pagination.Pagination.set_total_backgrounds();

            runInAction(() =>
                err(() => {
                    this.page = Math.ceil(
                        d_pagination.Pagination.total_backgrounds / this.backgrounds_per_page,
                    );
                }, 'cnt_1513'),
            );

            // eslint-disable-next-line max-len
            d_scrollable.Scrollable.set_scroll_backgrounds_scrollable_to_bottom_bool({
                bool: true,
            });
        }, 'cnt_1443');

    public set_last_if_page_empty = (): Promise<void> =>
        err_async(async () => {
            if (this.page_backgrounds.length === 0) {
                await this.set_last();
            }
        }, 'cnt_1443');

    public set_backgrounds_per_page_val = (): Promise<void> =>
        err_async(async () => {
            if (!d_sections.Restore.restoring_from_back_up) {
                runInAction(() =>
                    err(() => {
                        if (
                            data.settings.prefs.backgrounds_per_page <
                            this.backgrounds_per_page_min_val
                        ) {
                            this.backgrounds_per_page = this.backgrounds_per_page_min_val;
                        } else if (
                            data.settings.prefs.backgrounds_per_page >
                            this.backgrounds_per_page_max_val
                        ) {
                            this.backgrounds_per_page = this.backgrounds_per_page_max_val;
                        } else {
                            this.backgrounds_per_page = data.settings.prefs.backgrounds_per_page;
                        }
                    }, 'cnt_1512'),
                );

                await this.set_last();

                d_pagination.Pagination.build_pages();
            }
        }, 'cnt_1459');

    private set_backgrounds_per_page_val_debounce = debounce(
        this.set_backgrounds_per_page_val,
        500,
    );

    public set_page_backgrounds = (): void =>
        err(() => {
            this.offset = (this.page - 1) * this.backgrounds_per_page;
            const limit: number = this.offset + this.backgrounds_per_page;

            this.page_backgrounds = d_backgrounds.Backgrounds.backgrounds.slice(this.offset, limit);
        }, 'cnt_1447');

    public on_page_reaction = (): void =>
        err(() => {
            reaction(
                () => this.page,
                () => {
                    d_pagination.Pagination.build_pages();
                },
            );
        }, 'cnt_1448');

    public on_page_backgrounds_autorun = (): void =>
        err(() => {
            autorun(async () => {
                if (d_pagination.Page.page_backgrounds.length === 0) {
                    await d_pagination.Page.set_last();
                }
            });
        }, 'cnt_1448');

    public on_backgrounds_per_page_reaction = (): void =>
        err(() => {
            reaction(
                () => data.settings.prefs.backgrounds_per_page,
                this.set_backgrounds_per_page_val_debounce,
            );
        }, 'cnt_1457');
}

export const Page = Class.get_instance();
