import { makeObservable, observable, action } from 'mobx';

import { s_viewport } from '@loftyshaky/shared/shared';
import { d_pagination } from 'settings/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {
        makeObservable(this, {
            height: observable,
            pagination_height: observable,
            calculate_height: action,
        });
    }

    public height: number = 0;
    public pagination_height: number = 0;

    public calculate_height = (): void =>
        err(() => {
            const pagination_el = s<HTMLDivElement>('.pagination');
            const offset: number = 76;

            if (
                n(pagination_el) &&
                d_pagination.Page.there_are_backgrounds_for_more_than_one_page
            ) {
                this.pagination_height = d_pagination.Page
                    .there_are_backgrounds_for_more_than_one_page
                    ? pagination_el.offsetHeight
                    : 0;
                this.height =
                    s_viewport.Viewport.get_dim({ dim: 'height' }) -
                    (this.pagination_height + offset);
            } else {
                this.height = s_viewport.Viewport.get_dim({ dim: 'height' }) - (offset + 2);
            }
        }, 'cnt_1144');
}

export const Scrollable = Class.get_instance();
