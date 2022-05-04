import { s_utils } from '@loftyshaky/shared';
import { o_inputs, i_inputs } from '@loftyshaky/shared/inputs';
import { vars } from 'shared/internal';
import { d_scheduler, d_sections } from 'settings/internal';

export class DatePicker {
    private static i0: DatePicker;

    public static i(): DatePicker {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    private options: i_inputs.Options = {};
    public inputs: i_inputs.Input[] | i_inputs.Inputs = [];

    public init_options = (): void =>
        err(() => {
            this.options = {
                day_of_the_week: [
                    ...[new o_inputs.Option({ name: 'none', val: vars.scheduler_none_val })],
                    ...[
                        'sunday',
                        'monday',
                        'tuesday',
                        'wednesday',
                        'thursday',
                        'friday',
                        'saturday',
                    ].map(
                        (name: string, i: number): o_inputs.Option =>
                            err(
                                () => new o_inputs.Option({ name, val: i.toString() }),
                                'cnt_1230',
                            ),
                    ),
                ],
                month: [
                    ...[new o_inputs.Option({ name: 'none', val: vars.scheduler_none_val })],
                    ...[
                        'january',
                        'february',
                        'march',
                        'april',
                        'may',
                        'june',
                        'july',
                        'august',
                        'september',
                        'october',
                        'november',
                        'december',
                    ].map(
                        (name: string, i: number): o_inputs.Option =>
                            err(
                                () => new o_inputs.Option({ name, val: i.toString() }),
                                'cnt_1231',
                            ),
                    ),
                ],
                day_of_the_month: [
                    ...[new o_inputs.Option({ name: 'none', val: vars.scheduler_none_val })],
                    ...Array.from(
                        { length: 31 },
                        (not_used, i: number) =>
                            new o_inputs.Option({ name: (i + 1).toString(), val: i.toString() }),
                    ),
                ],
            };
        }, 'cnt_1232');

    public init_inputs = (): void =>
        err(() => {
            this.inputs = [
                new o_inputs.Text({
                    name: 'year',
                    text_type: 'number',
                    event_callback: d_scheduler.Val.i().change,
                    remove_val_callback: d_sections.Val.i().remove_val,
                    warn_state_checker: d_sections.Val.i().validate_input,
                }),
                new o_inputs.Select({
                    name: 'day_of_the_week',
                    options: this.options,
                    is_enabled_conds: [
                        {
                            input_name: 'day_of_the_month',
                            pass_vals: [vars.scheduler_none_val],
                        },
                    ],
                    event_callback: d_scheduler.Val.i().change,
                }),
                new o_inputs.Select({
                    name: 'month',
                    options: this.options,
                    event_callback: d_scheduler.Val.i().change,
                }),
                new o_inputs.Select({
                    name: 'day_of_the_month',
                    options: this.options,
                    is_enabled_conds: [
                        {
                            input_name: 'day_of_the_week',
                            pass_vals: [vars.scheduler_none_val],
                        },
                    ],
                    event_callback: d_scheduler.Val.i().change,
                }),
                new o_inputs.Text({
                    name: 'time',
                    event_callback: d_scheduler.Val.i().change,
                    remove_val_callback: d_sections.Val.i().remove_val,
                    warn_state_checker: d_sections.Val.i().validate_input,
                }),
                new o_inputs.Btn({
                    name: 'add_new_task',
                    event_callback: d_scheduler.Tasks.i().add,
                }),
            ];

            this.inputs = s_utils.Main.i().to_object({
                arr: this.inputs as i_inputs.Input[],
            });
        }, 'cnt_1233');
}
