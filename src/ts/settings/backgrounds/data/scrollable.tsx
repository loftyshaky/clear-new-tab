import { makeObservable, observable, action } from 'mobx';

import { s_viewport } from '@loftyshaky/shared';
import { d_pagination } from 'settings/internal';

export class Scrollable {
    private static i0: Scrollable;

    public static i(): Scrollable {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
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
                d_pagination.Page.i().there_are_backgrounds_for_more_than_one_page
            ) {
                this.pagination_height = d_pagination.Page.i()
                    .there_are_backgrounds_for_more_than_one_page
                    ? pagination_el.offsetHeight
                    : 0;
                this.height =
                    s_viewport.Main.i().get_dim({ dim: 'height' }) -
                    (this.pagination_height + offset);
            } else {
                this.height = s_viewport.Main.i().get_dim({ dim: 'height' }) - (offset + 2);
            }
        }, 'cnt_1144');
}
