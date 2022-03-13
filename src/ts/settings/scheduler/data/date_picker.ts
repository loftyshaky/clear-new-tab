import { s_utils } from '@loftyshaky/shared';
import { o_inputs, i_inputs } from '@loftyshaky/shared/inputs';

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
                    'none',
                    'monday',
                    'tuesday',
                    'wednesday',
                    'thursday',
                    'friday',
                    'saturday',
                    'sunday',
                ].map(
                    (name: string): o_inputs.Option =>
                        err(() => new o_inputs.Option({ name }), 'cnt_73478'),
                ),
                month: [
                    ...[new o_inputs.Option({ name: 'none' })],
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
                                'cnt_73478',
                            ),
                    ),
                ],
                day_of_the_month: [
                    ...[new o_inputs.Option({ name: 'none' })],
                    ...Array.from(
                        { length: 31 },
                        (not_used, i: number) =>
                            new o_inputs.Option({ name: (i + 1).toString(), val: i.toString() }),
                    ),
                ],
            };
        }, 'cnt_1127');

    public init_inputs = (): void =>
        err(() => {
            this.inputs = [
                new o_inputs.Text({
                    name: 'year',
                    event_callback: () => undefined,
                }),
                new o_inputs.Select({
                    name: 'day_of_the_week',
                    options: this.options,
                    event_callback: () => undefined,
                }),
                new o_inputs.Select({
                    name: 'month',
                    options: this.options,
                    event_callback: () => undefined,
                }),
                new o_inputs.Select({
                    name: 'day_of_the_month',
                    options: this.options,
                    event_callback: () => undefined,
                }),
                new o_inputs.Text({
                    name: 'time',
                    event_callback: () => undefined,
                }),
                new o_inputs.Btn({
                    name: 'add_new_task',
                    event_callback: () => undefined,
                }),
            ];

            this.inputs = s_utils.Main.i().to_object({
                arr: this.inputs as i_inputs.Input[],
            });
        }, 'cnt_11628');
}
