import _ from 'lodash';
import { isPresent } from 'ts-is-present';
import * as dateFns from 'date-fns';
import { s_db, i_db } from 'shared/internal';
import { s_backgrounds } from 'background/internal';

export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    private split_time = ({ time }: { time: string }): number[] =>
        err(
            () =>
                time.split(':').map((item: string): number =>
                    err(
                        () => +item,

                        'cnt_75676',
                    ),
                ),
            'cnt_75655',
        );

    public convert_tasks_to_alarm_data = (): Promise<i_db.AlarmDataItem[]> =>
        err_async(async () => {
            const tasks: i_db.Task[] = await s_db.Manipulation.i().get_tasks();

            const alarm_data: (i_db.AlarmDataItem | undefined)[] = tasks.map(
                (task: i_db.Task): i_db.AlarmDataItem | undefined =>
                    err(() => {
                        const bump_month = (): void =>
                            err(() => {
                                const next_month: number = month + 1;

                                if ([29, 30, 31].includes(day_of_the_month_final)) {
                                    date.setDate(1);
                                }

                                date.setMonth(next_month <= 11 ? next_month : 0);

                                shift_month_or_year_if_day_of_the_month_doesnt_exists({
                                    year_2: year,
                                    month_2: date.getMonth(),
                                });
                            }, 'cnt_76469');

                        const get_date_from_day_of_the_week = ({
                            day_of_the_week,
                            date_2,
                            next_year = false,
                        }: {
                            day_of_the_week: number;
                            date_2: Date;
                            next_year?: boolean;
                        }): Date =>
                            err(() => {
                                const month_2 = next_year ? date_2.getMonth() : month;
                                const is_previous_or_this_year: boolean =
                                    year <= now_date.getFullYear();

                                date_2.setMonth(month_2);

                                if (!year_is_none && !next_year) {
                                    const old_year_day_of_the_week: number = date_2.getDay();

                                    date_2.setFullYear(year);

                                    const day_of_the_week_difference: number =
                                        old_year_day_of_the_week - date_2.getDay();

                                    if (is_previous_or_this_year) {
                                        date_2.setDate(
                                            date_2.getDate() + day_of_the_week_difference,
                                        );
                                    }
                                }

                                if (next_year) {
                                    date_2.setDate(1);
                                }

                                if (!is_previous_or_this_year) {
                                    // April 4, 2022 > Saturday, December, 2023
                                    date_2.setDate(1);
                                }

                                date_2.setDate(date_2.getDate() - 1);

                                let current_or_next_day_of_the_week_date: Date = dateFns.nextDay(
                                    date_2,
                                    day_of_the_week as any,
                                );
                                const date_is_in_previous_month: boolean =
                                    current_or_next_day_of_the_week_date.getMonth() < month &&
                                    current_or_next_day_of_the_week_date.getFullYear() === year;
                                const date_is_in_next_month: boolean =
                                    !month_is_none &&
                                    (current_or_next_day_of_the_week_date.getMonth() > month ||
                                        (current_or_next_day_of_the_week_date.getMonth() > month &&
                                            current_or_next_day_of_the_week_date.getFullYear() >
                                                year));

                                if (date_is_in_previous_month) {
                                    current_or_next_day_of_the_week_date = dateFns.nextDay(
                                        current_or_next_day_of_the_week_date,
                                        day_of_the_week as any,
                                    );
                                } else if (date_is_in_next_month) {
                                    date_2.setDate(0);

                                    current_or_next_day_of_the_week_date = dateFns.nextDay(
                                        date_2,
                                        day_of_the_week as any,
                                    );
                                }

                                return current_or_next_day_of_the_week_date;
                            }, 'cnt_75666');

                        const shift_month_or_year_if_day_of_the_month_doesnt_exists = ({
                            month_2,
                            year_2,
                        }: {
                            year_2: number;
                            month_2: number;
                        }): void =>
                            err(() => {
                                const days_in_target_month_of_year: number = dateFns
                                    .lastDayOfMonth(new Date(year_2, month_2))
                                    .getDate();
                                const day_of_the_month_doesnt_exists: boolean =
                                    day_of_the_month_final > days_in_target_month_of_year;

                                if (day_of_the_month_doesnt_exists && day_of_the_week_is_none) {
                                    if (
                                        (day_of_the_month_final === 31 && !month_is_none) ||
                                        (day_of_the_month_final === 29 && !year_is_none)
                                    ) {
                                        // April 4, 2022 > February, 29 2023; April 4, 2022 > April 31 (31 doesnt exists in April)
                                        date_exists = false;
                                    } else if (day_of_the_month_final === 30 && month_2 === 1) {
                                        // February 2, 2022 > 30

                                        date.setDate(30);
                                    } else if (day_of_the_month_final === 31) {
                                        // April 4, 2022 > 31

                                        date.setDate(31);
                                    } else if (day_of_the_month_final === 29) {
                                        // April 4, 2022 > February 29

                                        date.setDate(1);
                                        date.setMonth(1);

                                        do {
                                            date.setFullYear(date.getFullYear() + 1);
                                        } while (dateFns.lastDayOfMonth(date).getDate() !== 29);

                                        date.setDate(29);
                                    }
                                }
                            }, 'cnt_75544');

                        let date_exists: boolean = true;
                        const now: number = Date.now();
                        const now_date: Date = new Date(now);
                        const current_date: Date = new Date();
                        const year_is_none: boolean = task.year === '';
                        const day_of_the_week_is_none: boolean = task.day_of_the_week === '';
                        const month_is_none: boolean = task.month === '';
                        const day_of_the_month_is_none: boolean = task.day_of_the_month === '';
                        const time: number[] = this.split_time({
                            time: task.time === '' ? '00:00:00' : task.time,
                        });
                        const year: number = year_is_none ? current_date.getFullYear() : +task.year;
                        const month: number = month_is_none ? current_date.getMonth() : +task.month;
                        const day_of_the_month: number = day_of_the_month_is_none
                            ? current_date.getDate()
                            : +task.day_of_the_month + 1;

                        const day_of_the_month_from_day_of_the_week: number =
                            day_of_the_week_is_none
                                ? get_date_from_day_of_the_week({
                                      day_of_the_week: current_date.getDay(),
                                      date_2: current_date,
                                  }).getDate()
                                : get_date_from_day_of_the_week({
                                      day_of_the_week: +task.day_of_the_week,
                                      date_2: current_date,
                                  }).getDate();

                        const day_of_the_month_final = day_of_the_week_is_none
                            ? day_of_the_month
                            : day_of_the_month_from_day_of_the_week;

                        let date = new Date(
                            year,
                            month,
                            day_of_the_month_final,
                            time[0],
                            time[1],
                            time[2],
                        );

                        shift_month_or_year_if_day_of_the_month_doesnt_exists({
                            year_2: year,
                            month_2: month,
                        });

                        //> set day of the month and month to 1/0 if date is after now
                        if (
                            (!year_is_none || !month_is_none) &&
                            day_of_the_month_is_none &&
                            day_of_the_week_is_none
                        ) {
                            // April 4, 2022 12:00:00 > 2023; Aprill 4, 2022 12:00:00 > June
                            const new_val: number = 1;

                            if (year_is_none && month < now_date.getMonth()) {
                                // April 4, 2022 12:00:00 > February
                                date.setDate(new_val);
                                date.setFullYear(year + 1);
                            }

                            const date_1_day_of_the_month = new Date(
                                year,
                                month,
                                new_val,
                                time[0],
                                time[1],
                                time[2],
                            );

                            if (date_1_day_of_the_month.getTime() > now) {
                                date.setDate(new_val);
                            }
                        }

                        if (!year_is_none && day_of_the_week_is_none && month_is_none) {
                            const new_val: number = 0;
                            const date_1_day_of_the_month = new Date(
                                year,
                                new_val,
                                day_of_the_month_final,
                                time[0],
                                time[1],
                                time[2],
                            );

                            if (date_1_day_of_the_month.getTime() > now) {
                                date.setMonth(new_val);
                            }
                        }
                        //<

                        if (
                            now > date.getTime() &&
                            day_of_the_week_is_none &&
                            day_of_the_month_is_none
                        ) {
                            const next_day_of_the_month: number = day_of_the_month_final + 1;
                            const number_of_days_in_month: number = new Date(
                                year,
                                month + 1,
                                0,
                            ).getDate();

                            date.setDate(
                                next_day_of_the_month <= number_of_days_in_month
                                    ? next_day_of_the_month
                                    : 1,
                            );

                            if (now > date.getTime() && month_is_none) {
                                bump_month();
                            }
                        }

                        if (
                            now > date.getTime() &&
                            month_is_none &&
                            (!day_of_the_week_is_none || !day_of_the_month_is_none)
                        ) {
                            bump_month();
                        }

                        if (now > date.getTime()) {
                            if (year_is_none) {
                                if (day_of_the_month_final === 29) {
                                    shift_month_or_year_if_day_of_the_month_doesnt_exists({
                                        year_2: year + 1,
                                        month_2: date.getMonth(),
                                    });
                                } else {
                                    date.setFullYear(year + 1);
                                }

                                if (!day_of_the_week_is_none) {
                                    const date_from_day_of_the_week_2: Date =
                                        get_date_from_day_of_the_week({
                                            day_of_the_week: +task.day_of_the_week,
                                            date_2: date,
                                            next_year: true,
                                        });

                                    date = date_from_day_of_the_week_2;
                                }
                            }
                        }

                        return date_exists
                            ? {
                                  id: x.unique_id(),
                                  date: date.getTime(),
                                  task_id: task.id,
                                  background_id: task.background_id,
                              }
                            : undefined;
                    }, 'cnt_56443'),
            );

            const alarm_data_final: i_db.AlarmDataItem[] = alarm_data.filter(isPresent);

            return alarm_data_final;
        }, 'cnt_54357');

    public schedule_background_display = ({
        called_after_task_completed = false,
    }: {
        called_after_task_completed?: boolean;
    } = {}): Promise<void> =>
        err_async(async () => {
            const handle_missed_tasks = (): Promise<void> =>
                err_async(async () => {
                    const alarm_data_2: i_db.AlarmDataItem[] =
                        await s_db.Manipulation.i().get_alarm_data();
                    const alarm_data_only_old: i_db.AlarmDataItem[] = alarm_data_2.filter(
                        (alarm_data_item: i_db.AlarmDataItem): boolean =>
                            err(() => alarm_data_item.date < now, 'cnt_75565'),
                    );
                    const closest_alarm_data_item_2: i_db.AlarmDataItem | undefined = _.maxBy(
                        alarm_data_only_old,
                        'date',
                    );

                    if (!called_after_task_completed && n(closest_alarm_data_item_2)) {
                        await s_backgrounds.Main.i().update_background({
                            background_id: closest_alarm_data_item_2.background_id,
                        });
                    }

                    await s_db.Manipulation.i().replace_alarm_data({
                        alarm_data: alarm_data_no_expired,
                    });
                }, 'cnt_54386');

            const remove_expired_tasks = (): Promise<void> =>
                err_async(async () => {
                    const expired_task_ids: string[] = alarm_data_only_expired.map(
                        (alarm_data_item: i_db.AlarmDataItem): string =>
                            err(() => alarm_data_item.task_id, 'cnt_75643'),
                    );

                    await s_db.Manipulation.i().delete_tasks({ ids: expired_task_ids });

                    await ext.send_msg_resp({ msg: 'update_tasks' });
                }, 'cnt_64636');

            const alarm_data: i_db.AlarmDataItem[] = await this.convert_tasks_to_alarm_data();
            const now: number = Date.now();
            const alarm_data_no_expired: i_db.AlarmDataItem[] = alarm_data.filter(
                (alarm_data_item: i_db.AlarmDataItem): boolean =>
                    err(() => alarm_data_item.date > now, 'cnt_75565'),
            );
            const alarm_data_only_expired: i_db.AlarmDataItem[] = alarm_data.filter(
                (alarm_data_item: i_db.AlarmDataItem): boolean =>
                    err(() => alarm_data_item.date < now, 'cnt_75565'),
            );

            const closest_alarm_data_item: i_db.AlarmDataItem | undefined = _.minBy(
                alarm_data_no_expired,
                'date',
            );

            await handle_missed_tasks();
            await remove_expired_tasks();

            if (n(closest_alarm_data_item)) {
                await we.alarms.clearAll();
                await we.alarms.create(closest_alarm_data_item.background_id, {
                    when: closest_alarm_data_item.date,
                });
            }
        }, 'cnt_54345');
}
