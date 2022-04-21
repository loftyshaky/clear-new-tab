import _ from 'lodash';
import { MouseEvent } from 'react';
import { makeObservable, action } from 'mobx';

import { s_i, i_db } from 'shared/internal';
import { d_dnd, d_scheduler } from 'settings/internal';

export class TaskDnd {
    private static i0: TaskDnd;

    public static i(): TaskDnd {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    private constructor() {
        makeObservable(this, {
            create_drop_zone: action,
        });
    }

    public start_drag = ({ task_to_move }: { task_to_move: i_db.Task }, e: MouseEvent): void =>
        err(() => {
            d_dnd.Main.i().drag_type = 'task';
            d_dnd.Main.i().mouse_is_down = true;
            d_dnd.Main.i().item_to_move = task_to_move;

            d_dnd.Main.i().initial_x = e.clientX;
            d_dnd.Main.i().initial_y = e.clientY;

            d_dnd.Main.i().item_to_move_i = s_i.Main.i().find_i_of_item_with_id({
                id: d_dnd.Main.i().item_to_move!.id,
                items: d_scheduler.Tasks.i().tasks,
            });
        }, 'cnt_53643');

    public stop_drag = (): Promise<void> =>
        err_async(async () => {
            await d_dnd.Main.i().stop_drag({ remove_drop_zone: this.remove_drop_zone });
        }, 'cnt_74545');

    public create_drop_zone = (
        { hovering_over_task }: { hovering_over_task: i_db.Task },
        e: MouseEvent,
    ): void =>
        err(() => {
            const drag_threshold_surpassed: boolean = d_dnd.Main.i().drag_threshold_surpassed({
                e,
            });

            if (
                d_dnd.Main.i().drag_type === 'task' &&
                (drag_threshold_surpassed || d_dnd.Main.i().dragging_item)
            ) {
                d_dnd.Main.i().dragging_item = true;
                d_dnd.Main.i().hovering_over_item = hovering_over_task;

                d_dnd.Main.i().set_drag_direction(e);
                d_dnd.Main.i().get_drop_zone_item({
                    items: d_scheduler.Tasks.i().tasks,
                });
                d_dnd.Main.i().insert_drop_zone();
            }
        }, 'cnt_74357');

    public remove_drop_zone = (): void =>
        err(() => {
            (d_scheduler.Tasks.i().tasks as any) = _.reject(
                d_scheduler.Tasks.i().tasks,
                (task: i_db.TaskDropZone): boolean => task.type === 'drop_zone',
            );
        }, 'cnt_86466');
}
