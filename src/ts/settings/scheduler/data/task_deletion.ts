import _ from 'lodash';
import { makeObservable, observable, action, runInAction } from 'mobx';
import { computedFn } from 'mobx-utils';

import { vars, s_db, i_db } from 'shared/internal';
import { d_protecting_screen, d_scheduler } from 'settings/internal';

export class TaskDeletion {
    private static i0: TaskDeletion;

    public static i(): TaskDeletion {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    private constructor() {
        makeObservable<TaskDeletion, 'deleting_background'>(this, {
            deleting_background: observable,
            trigger_delete: action,
            delete_all_tasks: action,
        });
    }

    private deleting_background: boolean = false;
    private background_to_delete_id: string = '';

    public deleted_cls = computedFn(function (this: TaskDeletion, { id }: { id: string }): string {
        return this.deleting_background && this.background_to_delete_id === id ? 'deleted' : '';
    });

    public trigger_delete = ({ id }: { id: string }): Promise<void> =>
        err_async(async () => {
            d_protecting_screen.Visibility.i().show();

            this.background_to_delete_id = id;
            this.deleting_background = true;

            await x.delay(data.settings.transition_duration + vars.item_deletion_delay);

            await this.delete({ id });

            d_protecting_screen.Visibility.i().hide();
        }, 'cnt_74674');

    private delete = ({ id }: { id: string }): Promise<void> =>
        err_async(async () => {
            runInAction(() =>
                err(() => {
                    d_scheduler.Tasks.i().tasks = _.reject(
                        d_scheduler.Tasks.i().tasks,
                        (task: i_db.Task) => task.id === id,
                    );
                }, 'cnt_74846'),
            );

            await s_db.Manipulation.i().delete_task({ id });

            runInAction(() =>
                err(() => {
                    this.deleting_background = false;
                }, 'cnt_56464'),
            );
        }, 'cnt_85356');

    public delete_from_background_id = ({ background_ids }: { background_ids: string[] }): void =>
        err(() => {
            background_ids.forEach((background_id: string): void =>
                err(() => {
                    const task_with_background_id: i_db.Task | undefined =
                        d_scheduler.Tasks.i().tasks.find((task: i_db.Task): boolean =>
                            err(() => task.background_id === background_id, 'cnt_74736'),
                        );

                    if (n(task_with_background_id)) {
                        this.trigger_delete({ id: task_with_background_id.id });
                    }

                    d_scheduler.Tasks.i().reset_background_id_from_background_id({ background_id });
                }, 'cnt_64674'),
            );
        }, 'cnt_75665');

    public delete_all_tasks = (): Promise<void> =>
        err_async(async () => {
            d_scheduler.Tasks.i().tasks = [];

            await s_db.Manipulation.i().clear_task_table();

            d_scheduler.Tasks.i().reset_background_id();
        }, 'cnt_54363');

    public delete_all_tasks_confirm = (): Promise<void> =>
        err_async(async () => {
            // eslint-disable-next-line no-alert
            if (window.confirm(ext.msg('delete_all_tasks_confirm'))) {
                await this.delete_all_tasks();
            }
        }, 'cnt_86432');
}
