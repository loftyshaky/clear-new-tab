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

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
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

    public delete_all_tasks = (): Promise<void> =>
        err_async(async () => {
            // eslint-disable-next-line no-alert
            if (window.confirm(ext.msg('delete_all_tasks_confirm'))) {
                d_scheduler.Tasks.i().tasks = [];

                await s_db.Manipulation.i().clear_task_table();
            }
        }, 'cnt_86432');
}
