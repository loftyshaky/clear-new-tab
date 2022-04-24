import { makeObservable, observable, action, runInAction } from 'mobx';
import { computedFn } from 'mobx-utils';

export class BackgroundAnimation {
    private static i0: BackgroundAnimation;

    public static i(): BackgroundAnimation {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    private constructor() {
        makeObservable<BackgroundAnimation, 'animated'>(this, {
            animated: observable,
            allow_animation: action,
        });
    }

    private animated: boolean = false;
    private already_animated_ids: string[] = [];

    public animated_cls = computedFn(function (
        this: BackgroundAnimation,
        { id }: { id: string },
    ): string {
        const already_animated_image_with_this_id: boolean = this.already_animated_ids.some(
            (id_2: string): boolean => err(() => id === id_2, 'cnt_63574'),
        );

        return this.animated && !already_animated_image_with_this_id ? 'animated' : '';
    });

    public allow_animation = (): void =>
        err(() => {
            this.animated = true;
        }, 'cnt_64683');

    public forbid_animation = (): Promise<void> =>
        err_async(async () => {
            await x.delay(data.settings.transition_duration);

            runInAction(() =>
                err(() => {
                    this.animated = false;
                }, 'cnt_64294'),
            );
        }, 'cnt_64683');

    public push_already_animated_id = ({ id }: { id: string }): void =>
        err(() => {
            this.already_animated_ids.push(id);
        }, 'cnt_49273');

    public push_already_animated_id_deferred = ({ id }: { id: string }): Promise<void> =>
        err_async(async () => {
            await x.delay(data.settings.transition_duration);

            this.push_already_animated_id({
                id,
            });
        }, 'cnt_75546');
}
