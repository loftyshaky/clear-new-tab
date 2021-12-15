import { makeObservable, action } from 'mobx';

export class GlobalCheckboxes {
    private static i0: GlobalCheckboxes;

    public static i(): GlobalCheckboxes {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {
        makeObservable(this, {
            set_global_checkbox_ui_values: action,
        });
    }

    public set_global_checkbox_ui_values = (): void =>
        err(() => {
            data.ui.color_of_area_around_background_global = false;
            data.ui.video_volume_global = false;
        }, 'cnt_75467');
}
