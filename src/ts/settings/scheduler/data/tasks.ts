import { makeObservable, observable, action, runInAction } from 'mobx';
import { BigNumber } from 'bignumber.js';

import { vars, s_db, s_i as s_i_shared, i_db } from 'shared/internal';
import { s_i, d_protecting_screen, d_scheduler, s_virtualized_list } from 'settings/internal';

export class Tasks {
    private static i0: Tasks;

    public static i(): Tasks {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {
        makeObservable(this, {
            tasks: observable,
            set_background_id: action,
            add: action,
        });
    }

    public tasks: i_db.Task[] = [];
    private months: { [index: string]: string } = {
        '0': 'january',
        '1': 'february',
        '2': 'march',
        '3': 'april',
        '4': 'may',
        '5': 'june',
        '6': 'july',
        '7': 'august',
        '8': 'september',
        '9': 'october',
        '10': 'november',
        '11': 'december',
    };

    private days_of_the_week: { [index: string]: string } = {
        '0': 'sunday',
        '1': 'monday',
        '2': 'tuesday',
        '3': 'wednesday',
        '4': 'thursday',
        '5': 'friday',
        '6': 'saturday',
    };

    public generate_date = ({ task }: { task: i_db.Task }): string =>
        err(() => {
            const day_of_the_week: string | undefined =
                task.day_of_the_week === vars.scheduler_none_val
                    ? undefined
                    : ext.msg(`${this.days_of_the_week[task.day_of_the_week]}_option_text`);
            const month: string | undefined =
                task.month === vars.scheduler_none_val
                    ? undefined
                    : ext.msg(`${this.months[task.month]}_option_text`);
            const day_of_the_month: string | undefined =
                task.day_of_the_month === vars.scheduler_none_val
                    ? undefined
                    : (+task.day_of_the_month + 1).toString();
            const year: string | undefined =
                task.year === vars.scheduler_none_val ? undefined : task.year;
            const time: string = task.time === vars.scheduler_none_val ? '' : task.time;
            let month_and_day_of_the_month: string | undefined;

            if (n(month)) {
                month_and_day_of_the_month = month;
            }

            if (n(day_of_the_month)) {
                if (!n(month)) {
                    month_and_day_of_the_month = '';
                }

                month_and_day_of_the_month += n(month) ? ` ${day_of_the_month}` : day_of_the_month;
            }

            const date_no_time_arr = [day_of_the_week, month_and_day_of_the_month, year].filter(
                (item: string | undefined): boolean => err(() => n(item), 'cnt_85347'),
            );

            const date_no_time: string = date_no_time_arr.join(', ');
            const date: string = date_no_time === '' ? time : `${date_no_time} ${time}`;

            return date;
        }, 'cnt_53675');

    public set_tasks = (): Promise<void> =>
        err_async(async () => {
            const tasks: i_db.Task[] = await s_db.Manipulation.i().get_tasks();

            runInAction(() =>
                err(() => {
                    this.tasks = s_i_shared.Main.i().sort_by_i_ascending({
                        data: tasks,
                    }) as i_db.Task[];
                }, 'cnt_64357'),
            );
        }, 'cnt_65456');

    public set_background_id = ({ background_id }: { background_id: string }): void =>
        err(() => {
            data.ui.background_id = background_id;
        }, 'cnt_75543');

    public add = (): Promise<void> =>
        err_async(async () => {
            d_protecting_screen.Visibility.i().show();

            const next_i: string = s_i.I.i().get_next_i({
                items: this.tasks,
            });

            const id: string = x.unique_id();
            const i: string = new BigNumber(next_i).toString();

            const new_task: i_db.Task = {
                id,
                i,
                background_id: data.ui.background_id,
                year: data.settings.year,
                day_of_the_week: data.settings.day_of_the_week,
                month: data.settings.month,
                day_of_the_month: data.settings.day_of_the_month,
                time: data.settings.time,
            };

            await s_db.Manipulation.i().save_tasks({ tasks: [new_task] });

            d_scheduler.TaskAnimation.i().trigger_animation({ id });

            this.tasks.push(new_task);

            await d_scheduler.TaskAnimation.i().forbid_animation();

            s_virtualized_list.VirtualizedList.i().set_bottom_scroll_position({
                virtualized_list_type: 'tasks',
            });

            d_protecting_screen.Visibility.i().hide();
        }, 'cnt_76435');
}
