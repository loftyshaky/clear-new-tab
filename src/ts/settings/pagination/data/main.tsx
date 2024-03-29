import React from 'react';
import { makeObservable, observable, reaction, action, runInAction } from 'mobx';

import Paginator from 'paginator';

import { svg, db } from 'shared/internal';

import { d_backgrounds, d_pagination, d_sections, p_pagination } from 'settings/internal';

export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    private constructor() {
        makeObservable(this, {
            total_backgrounds: observable,
            pagination_btns: observable,
            build_pages: action,
        });
    }

    public total_backgrounds: number = 0;
    public pagination_btns: p_pagination.PaginationBtn[] = [];

    public build_pages = (): void =>
        err(() => {
            d_backgrounds.Cache.i().reset_background_thumbnail_cache();
            d_pagination.Page.i().set_page_backgrounds();

            this.pagination_btns = [];

            const pagination_info = new Paginator(
                d_pagination.Page.i().backgrounds_per_page,
                5,
            ).build(this.total_backgrounds, d_pagination.Page.i().page);

            for (let i = pagination_info.first_page; i <= pagination_info.last_page; i += 1) {
                this.pagination_btns.push({
                    name: undefined,
                    on_click_page: i,
                    page_btn_content: i,
                    is_active: i === d_pagination.Page.i().page,
                    is_disabled: false,
                });
            }

            this.pagination_btns.unshift({
                name: 'previous_page',
                on_click_page: d_pagination.Page.i().page - 1,
                page_btn_content: <svg.NavigateBefore />,
                is_active: false,
                is_disabled: !pagination_info.has_previous_page,
            });
            this.pagination_btns.unshift({
                name: 'first_page',
                on_click_page: 1,
                page_btn_content: <svg.FirstPage />,
                is_active: false,
                is_disabled: !pagination_info.has_previous_page,
            });
            this.pagination_btns.push({
                name: 'next_page',
                on_click_page: d_pagination.Page.i().page + 1,
                page_btn_content: <svg.NavigateNext />,
                is_active: false,
                is_disabled: !pagination_info.has_next_page,
            });
            this.pagination_btns.push({
                name: 'last_page',
                on_click_page: this.total_backgrounds,
                page_btn_content: <svg.LastPage />,
                is_active: false,
                is_disabled: !pagination_info.has_next_page,
            });
        }, 'cnt_1465');

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
                    if (d_sections.Restore.i().restoring_from_back_up_pagination) {
                        d_sections.Restore.i().restoring_from_back_up_pagination = false;

                        await d_pagination.Page.i().set_backgrounds_per_page_val();

                        d_sections.SectionContent.i().set_backgrounds_section_content_visibility({
                            is_visible: true,
                        });
                    } else {
                        await this.set_total_backgrounds();

                        d_pagination.Page.i().set_page_backgrounds();
                    }
                },
                { fireImmediately: true },
            );
        }, 'cnt_1448');
}
