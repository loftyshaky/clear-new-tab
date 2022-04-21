import _ from 'lodash';
import { MouseEvent } from 'react';
import { makeObservable, observable, action } from 'mobx';
import { computedFn } from 'mobx-utils';

export class Actions {
    private static i0: Actions;

    public static i(): Actions {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    private constructor() {
        makeObservable<this, 'actions_visibility'>(this, {
            actions_visibility: observable,
            change_visibility: action,
            hide: action,
        });
    }

    private actions_visibility: { [index: string]: boolean } = {};

    public change_visibility = (
        { background_id }: { background_id: string },
        e: MouseEvent,
    ): void =>
        err(() => {
            e.stopPropagation();

            const is_visible: boolean = _.clone(this.actions_visibility)[background_id];

            this.actions_visibility = {};

            if (n(is_visible)) {
                this.actions_visibility[background_id] = !is_visible;
            } else {
                this.actions_visibility[background_id] = true;
            }
        }, 'cnt_64357');

    public is_visible = computedFn(function (
        this: Actions,
        {
            background_id,
        }: {
            background_id: string;
        },
    ): boolean {
        if (n(this.actions_visibility[background_id]) && this.actions_visibility[background_id]) {
            return this.actions_visibility[background_id];
        }

        return false;
    });

    public is_opened = computedFn(function (
        this: Actions,
        {
            background_id,
        }: {
            background_id: string;
        },
    ): string {
        if (n(this.actions_visibility[background_id]) && this.actions_visibility[background_id]) {
            return 'is_opened';
        }

        return '';
    });

    public hide = (e: MouseEvent): void =>
        err(() => {
            if (!x.closest(e.target as HTMLElement, '.actions')) {
                this.actions_visibility = {};
            }
        }, 'cnt_75432');
}
