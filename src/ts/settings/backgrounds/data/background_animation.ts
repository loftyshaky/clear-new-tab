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
            (id_2: string): boolean => err(() => id === id_2, 'cnt_1094'),
        );

        return this.animated && !already_animated_image_with_this_id ? 'animated' : '';
    });

    public allow_animation = (): void =>
        err(() => {
            this.animated = true;
        }, 'cnt_1095');

    public forbid_animation = (): Promise<void> =>
        err_async(async () => {
            await x.delay(data.settings.transition_duration);

            runInAction(() =>
                err(() => {
                    this.animated = false;
                }, 'cnt_1096'),
            );
        }, 'cnt_1097');

    public push_already_animated_id = ({ id }: { id: string }): void =>
        err(() => {
            if (!this.already_animated_ids.includes(id)) {
                this.already_animated_ids.push(id);
            }
        }, 'cnt_1098');

    public push_already_animated_id_deferred = ({ id }: { id: string }): Promise<void> =>
        err_async(async () => {
            await x.delay(data.settings.transition_duration);

            this.push_already_animated_id({
                id,
            });
        }, 'cnt_1099');

    public remove_already_animated_ids = ({ ids }: { ids: string[] }): void =>
        err(() => {
            ids.forEach((id_to_remove: string): void =>
                err(() => {
                    x.remove_item(
                        this.already_animated_ids.indexOf(id_to_remove),
                        this.already_animated_ids,
                    );
                }, 'cnt_1417'),
            );
        }, 'cnt_1415');

    public remove_all_already_animated_ids = (): void =>
        err(() => {
            this.already_animated_ids = [];
        }, 'cnt_1416');
}
