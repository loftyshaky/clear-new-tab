import { makeObservable, action } from 'mobx';

import { i_inputs, i_color } from '@loftyshaky/shared/inputs';
import { i_data } from 'shared/internal';
import { d_scheduler, d_sections } from 'settings/internal';

export class Val {
    private static i0: Val;

    public static i(): Val {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    private constructor() {
        makeObservable(this, {
            set_add_new_task_btn_ability: action,
        });
    }

    public change = ({ input, i }: { input: i_inputs.Input; i?: i_color.I }): Promise<void> =>
        err_async(async () => {
            await d_sections.Val.i().change({ input, i });

            await this.set_add_new_task_btn_ability();
        }, 'cnt_64677');

    public set_add_new_task_btn_ability = (): Promise<void> =>
        err_async(async () => {
            const settings: i_data.Settings = await ext.storage_get();

            const background_is_selected: boolean =
                d_scheduler.BackgroundPreview.i().get({ background_id: data.ui.background_id }) !==
                d_scheduler.BackgroundPreview.i().placeholder_img_name;

            const one_of_inputs_in_date_picker_is_set_to_val = Object.values(
                d_scheduler.DatePicker.i().inputs,
            ).some((input: i_inputs.Input): boolean =>
                err(
                    () =>
                        n(settings[input.name]) &&
                        settings[input.name] !== '' &&
                        !input.is_in_warn_state,

                    'cnt_64678',
                ),
            );

            (
                d_scheduler.DatePicker.i().inputs as Record<string, i_inputs.Input>
            ).add_new_task.is_enabled =
                background_is_selected && one_of_inputs_in_date_picker_is_set_to_val;
        }, 'cnt_74356');
}
