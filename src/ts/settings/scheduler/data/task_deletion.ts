import reject from 'lodash/reject';
import { makeObservable, observable, action, runInAction } from 'mobx';
import { computedFn } from 'mobx-utils';

import { vars, s_db, i_db } from 'shared_clean/internal';
import { d_protecting_screen, d_scheduler } from 'settings/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {
        makeObservable<Class, 'deleting_background'>(this, {
            deleting_background: observable,
            trigger_delete: action,
            delete_all_tasks: action,
        });
    }

    private deleting_background: boolean = false;
    private background_to_delete_id: string = '';

    public deleted_cls = computedFn(function (this: Class, { id }: { id: string }): string {
        return this.deleting_background && this.background_to_delete_id === id ? 'deleted' : '';
    });

    public trigger_delete = ({ id }: { id: string }): Promise<void> =>
        err_async(async () => {
            d_protecting_screen.Visibility.show();

            this.background_to_delete_id = id;
            this.deleting_background = true;

            await x.delay(data.settings.prefs.transition_duration + vars.item_deletion_delay);

            await this.delete({ id });

            d_protecting_screen.Visibility.hide();
        }, 'cnt_1239');

    private delete = ({ id }: { id: string }): Promise<void> =>
        err_async(async () => {
            runInAction(() =>
                err(() => {
                    d_scheduler.Tasks.tasks = reject(
                        d_scheduler.Tasks.tasks,
                        (task: i_db.Task) => task.id === id,
                    );
                }, 'cnt_1240'),
            );

            await s_db.Manipulation.delete_task({ id });

            runInAction(() =>
                err(() => {
                    this.deleting_background = false;
                }, 'cnt_1241'),
            );
        }, 'cnt_1242');

    public delete_from_background_id = ({ background_ids }: { background_ids: string[] }): void =>
        err(() => {
            background_ids.forEach((background_id: string): void =>
                err(() => {
                    const task_with_background_id: i_db.Task | undefined =
                        d_scheduler.Tasks.tasks.find((task: i_db.Task): boolean =>
                            err(() => task.background_id === background_id, 'cnt_1243'),
                        );

                    if (n(task_with_background_id)) {
                        this.trigger_delete({ id: task_with_background_id.id });
                    }

                    d_scheduler.Tasks.reset_background_id_from_background_id({ background_id });
                }, 'cnt_1244'),
            );
        }, 'cnt_1245');

    public delete_all_tasks = (): Promise<void> =>
        err_async(async () => {
            d_scheduler.Tasks.tasks = [];

            await s_db.Manipulation.clear_task_table();

            d_scheduler.Tasks.reset_background_id();
        }, 'cnt_1246');

    public delete_all_tasks_confirm = (): Promise<void> =>
        err_async(async () => {
            // eslint-disable-next-line no-alert
            if (globalThis.confirm(ext.msg('delete_all_tasks_confirm'))) {
                await this.delete_all_tasks();
            }
        }, 'cnt_1247');
}

export const TaskDeletion = Class.get_instance();
