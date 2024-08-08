import { makeObservable, observable, computed, action } from 'mobx';

import { d_progress } from 'shared/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {
        makeObservable<this, 'is_visible' | 'show' | 'hide'>(this, {
            is_visible: observable,
            visibility_cls: computed,
            show: action,
            hide: action,
        });
    }

    private is_visible: boolean = false;

    public get visibility_cls() {
        return this.is_visible ? '' : 'none';
    }

    private change = ({
        is_visible,
        enable_progress,
    }: {
        is_visible: boolean;
        enable_progress: boolean;
    }): void =>
        err(() => {
            this.is_visible = is_visible;

            if (enable_progress) {
                d_progress.Visibility.change({ is_visible });
            }
        }, 'cnt_1438');

    public show = ({ enable_progress = false }: { enable_progress?: boolean } = {}): void =>
        err(() => {
            this.change({ is_visible: true, enable_progress });
        }, 'cnt_1227');

    public hide = (): void =>
        err(() => {
            this.change({ is_visible: false, enable_progress: true });
        }, 'cnt_1228');
}

export const Visibility = Class.get_instance();
