import { makeObservable, observable, action, runInAction } from 'mobx';
import { computedFn } from 'mobx-utils';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {
        makeObservable<Class, 'animating_task'>(this, {
            animating_task: observable,
            trigger_animation: action,
        });
    }

    private animating_task: boolean = false;
    private background_to_animate_id: string = '';

    public animated_cls = computedFn(function (this: Class, { id }: { id: string }): string {
        return this.animating_task && this.background_to_animate_id === id ? 'animated' : '';
    });

    public trigger_animation = ({ id }: { id: string }): void =>
        err(() => {
            this.background_to_animate_id = id;
            this.animating_task = true;
        }, 'cnt_1236');

    public forbid_animation = (): Promise<void> =>
        err_async(async () => {
            await x.delay(data.settings.transition_duration);

            runInAction(() =>
                err(() => {
                    this.animating_task = false;
                }, 'cnt_1237'),
            );
        }, 'cnt_1238');
}

export const TaskAnimation = Class.get_instance();
