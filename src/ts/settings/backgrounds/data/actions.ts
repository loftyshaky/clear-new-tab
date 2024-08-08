import clone from 'lodash/clone';
import { MouseEvent } from 'react';
import { makeObservable, observable, action } from 'mobx';
import { computedFn } from 'mobx-utils';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
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

            const is_visible: boolean = clone(this.actions_visibility)[background_id];

            this.actions_visibility = {};

            if (n(is_visible)) {
                this.actions_visibility[background_id] = !is_visible;
            } else {
                this.actions_visibility[background_id] = true;
            }
        }, 'cnt_1092');

    public is_visible = computedFn(function (
        this: Class,
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
        this: Class,
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
        }, 'cnt_1093');
}

export const Actions = Class.get_instance();
