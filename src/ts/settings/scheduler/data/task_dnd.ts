import reject from 'lodash/reject';
import { MouseEvent } from 'react';
import { makeObservable, action } from 'mobx';

import { s_i, i_db } from 'shared_clean/internal';
import { d_dnd, d_scheduler } from 'settings/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {
        makeObservable(this, {
            create_drop_zone: action,
            remove_drop_zone: action,
        });
    }

    public start_drag = ({ task_to_move }: { task_to_move: i_db.Task }, e: MouseEvent): void =>
        err(() => {
            d_dnd.Dnd.drag_type = 'task';
            d_dnd.Dnd.mouse_is_down = true;
            d_dnd.Dnd.item_to_move = task_to_move;

            d_dnd.Dnd.initial_x = e.clientX;
            d_dnd.Dnd.initial_y = e.clientY;

            d_dnd.Dnd.item_to_move_i = s_i.I.find_i_of_item_with_id({
                id: d_dnd.Dnd.item_to_move!.id,
                items: d_scheduler.Tasks.tasks,
            });
        }, 'cnt_1248');

    public stop_drag = (): Promise<void> =>
        err_async(async () => {
            await d_dnd.Dnd.stop_drag({ remove_drop_zone: this.remove_drop_zone });
        }, 'cnt_1249');

    public create_drop_zone = (
        { hovering_over_task }: { hovering_over_task: i_db.Task },
        e: MouseEvent,
    ): void =>
        err(() => {
            const drag_threshold_surpassed: boolean = d_dnd.Dnd.drag_threshold_surpassed({
                e,
            });

            if (
                d_dnd.Dnd.drag_type === 'task' &&
                (drag_threshold_surpassed || d_dnd.Dnd.dragging_item)
            ) {
                d_dnd.Dnd.dragging_item = true;
                d_dnd.Dnd.hovering_over_item = hovering_over_task;

                d_dnd.Dnd.set_drag_direction(e);
                d_dnd.Dnd.get_drop_zone_item({
                    items: d_scheduler.Tasks.tasks,
                });
                d_dnd.Dnd.insert_drop_zone();
            }
        }, 'cnt_1250');

    public remove_drop_zone = (): void =>
        err(() => {
            (d_scheduler.Tasks.tasks as any) = reject(
                d_scheduler.Tasks.tasks,
                (task: i_db.TaskDropZone): boolean => task.type === 'drop_zone',
            );
        }, 'cnt_1251');
}

export const TaskDnd = Class.get_instance();
