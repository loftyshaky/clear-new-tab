import { runInAction } from 'mobx';

import { i_inputs, i_color } from '@loftyshaky/shared/inputs';
import { i_data } from 'shared_clean/internal';
import { d_scheduler, d_sections } from 'settings/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public change = ({ input, i }: { input: i_inputs.Input; i?: i_color.I }): Promise<void> =>
        err_async(async () => {
            await d_sections.Val.change({ input, i });

            await this.set_add_new_task_btn_ability();
        }, 'cnt_1263');

    public set_add_new_task_btn_ability = (): Promise<void> =>
        err_async(async () => {
            const settings: i_data.Settings = await ext.storage_get();

            const background_is_selected: boolean =
                (await d_scheduler.BackgroundPreview.get({
                    background_id: data.ui.background_id,
                })) !== d_scheduler.BackgroundPreview.placeholder_img;
            const one_of_inputs_in_date_picker_is_set_to_val = Object.values(
                d_scheduler.DatePicker.inputs,
            ).some((input: i_inputs.Input): boolean =>
                err(() => n(settings[input.name]) && settings[input.name] !== '', 'cnt_1264'),
            );
            const all_inputs_are_in_success_state = Object.values(
                d_scheduler.DatePicker.inputs,
            ).every((input: i_inputs.Input): boolean =>
                err(() => !input.is_in_warn_state, 'cnt_1425'),
            );

            runInAction(() =>
                err(() => {
                    (
                        d_scheduler.DatePicker.inputs as Record<string, i_inputs.Input>
                    ).add_new_task.is_enabled =
                        background_is_selected &&
                        one_of_inputs_in_date_picker_is_set_to_val &&
                        all_inputs_are_in_success_state;
                }, 'cnt_1265'),
            );
        }, 'cnt_1266');
}

export const Val = Class.get_instance();
