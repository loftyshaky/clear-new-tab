import _ from 'lodash';
import { MouseEvent } from 'react';
import { makeObservable, observable, computed, action, runInAction, toJS } from 'mobx';
import { BigNumber } from 'bignumber.js';

import { t } from '@loftyshaky/shared';
import { s_db, s_i, i_db } from 'shared/internal';
import {
    d_backgrounds,
    d_dnd,
    d_pagination,
    d_scheduler,
    s_backgrounds,
    i_backgrounds,
} from 'settings/internal';

export class Main {
    private static i0: Main;

    public static i(): Main {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    private constructor() {
        makeObservable(this, {
            show_dragged_background: observable,
            dragging_item: observable,
            dragged_background_left: observable,
            dragged_background_top: observable,
            pointer_events_none_cls: computed,
            cursor_default_cls: computed,
            stop_drag: action,
            get_drop_zone_item: action,
            insert_drop_zone: action,
            set_dragged_item_position: action,
        });
    }

    public drag_type: string = 'background';
    public drag_direction: string = 'right';
    public show_dragged_background: boolean = false;
    public dragging_item: boolean = false;
    public drop_zone_insert_direction: string = 'right';
    public mouse_is_down: boolean = false;
    public initial_x: number = 0;
    public initial_y: number = 0;
    private current_x: number = 0;
    private current_y: number = 0;
    public drag_threshold: number = 10;
    public item_to_move: i_db.Background | i_db.Task | undefined;
    public item_to_move_i: number = 0;
    public hovering_over_item: i_db.Background | i_db.Task | undefined;
    public drop_zone_item: i_db.Background | i_db.Task | undefined = undefined;
    private previous_drop_zone_background_i: number = 0;
    public dragged_background_offset: number = 7;
    public dragged_background_left: number = 0;
    public dragged_background_top: number = 0;

    public get pointer_events_none_cls() {
        return d_dnd.Main.i().dragging_item ? 'pointer_events_none' : '';
    }

    public get cursor_default_cls() {
        return d_dnd.Main.i().dragging_item ? 'cursor_default' : '';
    }

    public dragged_item_cls = ({ dragged }: { dragged: boolean }): string =>
        err(() => (dragged ? 'dragged_item' : ''), 'cnt_1206');

    public stop_drag = ({
        remove_drop_zone,
    }: {
        remove_drop_zone: t.CallbackVoid;
    }): Promise<void> =>
        err_async(async () => {
            d_dnd.Main.i().mouse_is_down = false;
            d_dnd.Main.i().dragging_item = false;
            d_dnd.Main.i().show_dragged_background = false;

            remove_drop_zone();

            await x.delay(100);
        }, 'cnt_1207');

    public drag_threshold_surpassed = ({ e }: { e: MouseEvent }): boolean =>
        err(
            () =>
                this.mouse_is_down &&
                (e.clientX - this.initial_x >= this.drag_threshold ||
                    e.clientX - this.initial_x <= -this.drag_threshold ||
                    e.clientY - this.initial_y >= this.drag_threshold ||
                    e.clientY - this.initial_y <= -this.drag_threshold),
            'cnt_1208',
        );

    public set_drag_direction = (e: MouseEvent): void =>
        err(() => {
            const axis = this.drag_type === 'background' ? 'x' : 'y';
            const client = axis === 'x' ? e.clientX : e.clientY;
            const moved_mouse_downward = this[`current_${axis}`] < client;
            const moved_mouse_upward = this[`current_${axis}`] > client;
            const stayed_at_the_same_coords = this[`current_${axis}`] === client;

            if (moved_mouse_downward || stayed_at_the_same_coords) {
                this.drag_direction = 'right';
            } else if (moved_mouse_upward) {
                this.drag_direction = 'left';
            }

            this.current_x = e.clientX;
            this.current_y = e.clientY;
        }, 'cnt_1209');

    public get_drop_zone_item = ({ items }: { items: i_db.Background[] | i_db.Task[] }): void =>
        err(() => {
            if (n(this.hovering_over_item) && n(this.item_to_move)) {
                const get_drop_zone_background_inner = ({
                    drop_zone_insert_direction,
                    i_modifier_1,
                    i_modifier_2,
                }: {
                    drop_zone_insert_direction: string;
                    i_modifier_1: number;
                    i_modifier_2: number;
                }): void =>
                    err(() => {
                        if (n(this.item_to_move) && n(this.hovering_over_item)) {
                            if (this.item_to_move.id === this.hovering_over_item.id) {
                                this.drop_zone_insert_direction = this.drag_direction;
                                this.drop_zone_item = items_2[this.item_to_move_i + i_modifier_1];
                            } else if (
                                n(items_2[this.item_to_move_i + i_modifier_2]) &&
                                this.hovering_over_item.id ===
                                    items_2[this.item_to_move_i + i_modifier_2].id
                            ) {
                                if (n(items_2[this.item_to_move_i + i_modifier_1])) {
                                    this.drop_zone_insert_direction = this.drag_direction;
                                    this.drop_zone_item =
                                        items_2[this.item_to_move_i + i_modifier_1];
                                } else {
                                    this.drop_zone_insert_direction = drop_zone_insert_direction;
                                    this.drop_zone_item = this.hovering_over_item;
                                }
                            } else {
                                this.drop_zone_insert_direction = this.drag_direction;
                                this.drop_zone_item = this.hovering_over_item;
                            }
                        }
                    }, 'cnt_1210');

                const items_2: i_db.Background[] | i_db.Task[] = toJS(
                    _.reject(items as any, (item: any) => item.type === 'drop_zone'),
                );

                const only_one_background_exist = items_2.length === 1;
                const dragging_first_background_over_first_background =
                    this.item_to_move.id === this.hovering_over_item.id &&
                    this.item_to_move.id === items_2[0].id;
                const dragging_last_background_over_last_background =
                    this.item_to_move.id === this.hovering_over_item.id &&
                    this.item_to_move.id === items_2[items_2.length - 1].id;
                const drag_direction_1: string = 'right';
                const drag_direction_2: string = 'left';

                if (only_one_background_exist) {
                    this.drop_zone_item = undefined;
                } else if (dragging_first_background_over_first_background) {
                    this.drop_zone_insert_direction = drag_direction_1;
                    // eslint-disable-next-line prefer-destructuring
                    this.drop_zone_item = items_2[1];
                } else if (dragging_last_background_over_last_background) {
                    this.drop_zone_insert_direction = drag_direction_2;

                    this.drop_zone_item = items_2[items_2.length - 2];
                } else if (this.drag_direction === drag_direction_1) {
                    get_drop_zone_background_inner({
                        drop_zone_insert_direction: drag_direction_2,
                        i_modifier_1: 1,
                        i_modifier_2: -1,
                    });
                } else if (this.drag_direction === drag_direction_2) {
                    get_drop_zone_background_inner({
                        drop_zone_insert_direction: drag_direction_1,
                        i_modifier_1: -1,
                        i_modifier_2: 1,
                    });
                }
            }
        }, 'cnt_1211');

    public insert_drop_zone = (): void =>
        err(() => {
            if (n(this.show_dragged_background) && n(this.drop_zone_item) && n(this.item_to_move)) {
                this.remove_drop_zone();

                const drop_zone_background_i: number = s_i.Main.i().find_i_of_item_with_id({
                    id: d_dnd.Main.i().drop_zone_item!.id,
                    items:
                        this.drag_type === 'background'
                            ? d_pagination.Page.i().page_backgrounds
                            : d_scheduler.Tasks.i().tasks,
                });

                const insertion_i =
                    d_dnd.Main.i().drop_zone_insert_direction === 'right'
                        ? drop_zone_background_i + 1
                        : drop_zone_background_i;
                const drop_zone: i_db.BackgroundDropZone | i_db.TaskDropZone = {
                    type: 'drop_zone',
                    ...(this.drag_type === 'background'
                        ? {
                              width: s_backgrounds.Thumbnail.i().get_background_thumbnail_width({
                                  background: d_dnd.Main.i().item_to_move as i_db.Background,
                              }),
                          }
                        : {}),
                };

                const items_with_drop_zone: i_db.Background[] | i_db.Task[] = x.insert_item(
                    insertion_i,
                    [drop_zone],
                    this.drag_type === 'background'
                        ? d_pagination.Page.i().page_backgrounds
                        : d_scheduler.Tasks.i().tasks,
                );

                if (this.drag_type === 'background') {
                    d_pagination.Page.i().page_backgrounds =
                        items_with_drop_zone as i_db.Background[];
                } else if (this.drag_type === 'task') {
                    d_scheduler.Tasks.i().tasks = items_with_drop_zone as i_db.Task[];
                }
            }
        }, 'cnt_1212');

    private remove_drop_zone = (): void =>
        err(() => {
            if (this.drag_type === 'background') {
                d_backgrounds.Dnd.i().remove_drop_zone();
            } else if (this.drag_type === 'task') {
                d_scheduler.TaskDnd.i().remove_drop_zone();
            }
        }, 'cnt_1213');

    public set_dragged_item_position = (e: MouseEvent): void =>
        err(() => {
            if (d_dnd.Main.i().dragging_item && n(d_dnd.Main.i().item_to_move)) {
                d_dnd.Main.i().show_dragged_background = true;

                d_dnd.Main.i().dragged_background_top =
                    e.clientY + d_dnd.Main.i().dragged_background_offset;
                d_dnd.Main.i().dragged_background_left =
                    d_dnd.Main.i().drag_type === 'background'
                        ? e.clientX -
                          s_backgrounds.Thumbnail.i().get_background_thumbnail_width({
                              background: d_dnd.Main.i().item_to_move as i_db.Background,
                          }) -
                          d_dnd.Main.i().dragged_background_offset
                        : e.clientX + d_dnd.Main.i().dragged_background_offset;
            }
        }, 'cnt_1214');

    public drop = async (): Promise<void> =>
        err_async(async () => {
            this.remove_drop_zone();

            if (n(d_dnd.Main.i().item_to_move) && n(d_dnd.Main.i().drop_zone_item)) {
                if (this.drag_type === 'background') {
                    d_dnd.Main.i().item_to_move_i = s_i.Main.i().find_i_of_item_with_id({
                        id: d_dnd.Main.i().item_to_move!.id,
                        items: d_backgrounds.Main.i().backgrounds,
                    });
                }

                const items: i_db.Background[] | i_db.Task[] =
                    this.drag_type === 'background'
                        ? d_backgrounds.Main.i().backgrounds
                        : d_scheduler.Tasks.i().tasks;
                const drop_zone_background_i: number = s_i.Main.i().find_i_of_item_with_id({
                    id: d_dnd.Main.i().drop_zone_item!.id,
                    items,
                });

                const move_dragged_background = ({
                    drop_zone_insert_direction,
                }: {
                    drop_zone_insert_direction: i_backgrounds.DropZoneInsertDirection;
                }): void =>
                    err(
                        action(() => {
                            if (
                                d_dnd.Main.i().drop_zone_insert_direction ===
                                drop_zone_insert_direction
                            ) {
                                set_intermediate_i({
                                    drop_zone_insert_direction,
                                    modifier_1: -1,
                                    modifier_2: 0,
                                    modifier_3: 0,
                                    modifier_4: 1,
                                });
                            } else {
                                const dropped_at_trailing_left_position =
                                    drop_zone_background_i === 0;
                                const dropped_at_trailing_right_position =
                                    drop_zone_background_i === items.length - 1;

                                if (
                                    dropped_at_trailing_left_position ||
                                    dropped_at_trailing_right_position
                                ) {
                                    const trailing_drop_zone_background_i: number =
                                        // eslint-disable-next-line max-len
                                        s_i.Main.i().find_i_of_item_with_id({
                                            id: items[drop_zone_background_i].id,
                                            items,
                                        });

                                    const new_i: string = new BigNumber(
                                        items[trailing_drop_zone_background_i].i,
                                    )
                                        [dropped_at_trailing_left_position ? 'minus' : 'plus'](1)
                                        .toString();

                                    if (this.drag_type === 'background') {
                                        d_backgrounds.Main.i().backgrounds[this.item_to_move_i].i =
                                            new_i;
                                    } else if (this.drag_type === 'task') {
                                        d_scheduler.Tasks.i().tasks[this.item_to_move_i].i = new_i;
                                    }
                                } else {
                                    set_intermediate_i({
                                        drop_zone_insert_direction,
                                        modifier_1: 0,
                                        modifier_2: -1,
                                        modifier_3: 1,
                                        modifier_4: 0,
                                    });
                                }
                            }
                        }),
                        'cnt_1215',
                    );

                const set_intermediate_i = ({
                    drop_zone_insert_direction,
                    modifier_1,
                    modifier_2,
                    modifier_3,
                    modifier_4,
                }: {
                    drop_zone_insert_direction: i_backgrounds.DropZoneInsertDirection;
                    modifier_1: number;
                    modifier_2: number;
                    modifier_3: number;
                    modifier_4: number;
                }): void =>
                    err(
                        action(() => {
                            const drop_zone_background_left_i: number =
                                // eslint-disable-next-line max-len
                                s_i.Main.i().find_i_of_item_with_id({
                                    id: items[
                                        drop_zone_background_i +
                                            (drop_zone_insert_direction === 'left'
                                                ? modifier_1
                                                : modifier_2)
                                    ].id,
                                    items,
                                });
                            const drop_zone_background_right_i: number =
                                // eslint-disable-next-line max-len
                                s_i.Main.i().find_i_of_item_with_id({
                                    id: items[
                                        drop_zone_background_i +
                                            (drop_zone_insert_direction === 'left'
                                                ? modifier_3
                                                : modifier_4)
                                    ].id,
                                    items,
                                });

                            const i_of_background_to_the_left_of_drop_zone: string =
                                items[drop_zone_background_left_i].i;
                            const i_of_background_to_the_right_of_drop_zone: string =
                                items[drop_zone_background_right_i].i;
                            const intermediate_i: string = new BigNumber(
                                i_of_background_to_the_left_of_drop_zone,
                            )
                                .plus(i_of_background_to_the_right_of_drop_zone)
                                .div(2)
                                .toString();

                            if (this.drag_type === 'background') {
                                d_backgrounds.Main.i().backgrounds[
                                    d_dnd.Main.i().item_to_move_i
                                ].i = intermediate_i;
                            } else if (this.drag_type === 'task') {
                                d_scheduler.Tasks.i().tasks[d_dnd.Main.i().item_to_move_i].i =
                                    intermediate_i;
                            }
                        }),
                        'cnt_1216',
                    );

                if (d_dnd.Main.i().item_to_move_i < drop_zone_background_i) {
                    move_dragged_background({
                        drop_zone_insert_direction: 'left',
                    });
                } else if (d_dnd.Main.i().item_to_move_i > drop_zone_background_i) {
                    move_dragged_background({
                        drop_zone_insert_direction: 'right',
                    });
                }

                if (data.settings.update_database_when_dnd_item) {
                    if (this.drag_type === 'background') {
                        await s_db.Manipulation.i().update_background({
                            background: d_backgrounds.Main.i().backgrounds[
                                d_dnd.Main.i().item_to_move_i
                            ] as i_db.Background,
                        });
                    } else if (this.drag_type === 'task') {
                        await s_db.Manipulation.i().update_task({
                            task: d_scheduler.Tasks.i().tasks[
                                d_dnd.Main.i().item_to_move_i
                            ] as i_db.Task,
                        });
                    }
                }

                runInAction(() =>
                    err(() => {
                        if (this.drag_type === 'background') {
                            d_backgrounds.Main.i().backgrounds = s_i.Main.i().sort_by_i_ascending({
                                data: d_backgrounds.Main.i().backgrounds,
                            }) as i_db.Background[];

                            d_backgrounds.CurrentBackground.i().set_current_background_i();
                            d_pagination.Page.i().set_page_backgrounds();
                            // eslint-disable-next-line max-len
                        } else if (this.drag_type === 'task') {
                            d_scheduler.Tasks.i().tasks = s_i.Main.i().sort_by_i_ascending({
                                data: items,
                            }) as i_db.Task[];
                        }
                    }, 'cnt_1217'),
                );
            }
        }, 'cnt_1218');
}
