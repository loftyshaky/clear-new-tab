import _ from 'lodash';
import { MouseEvent } from 'react';
import { makeObservable, observable, computed, action, toJS } from 'mobx';

import { s_db, i_db } from 'shared/internal';
import { d_backgrounds, s_backgrounds } from 'settings/internal';

export class Dnd {
    private static i0: Dnd;

    public static i(): Dnd {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {
        makeObservable<Dnd, 'dragging_background' | 'insert_drop_zone' | 'remove_drop_zone'>(this, {
            drop_zone_insert_direction: observable,
            dragging_background: observable,
            show_dragged_background: observable,
            dragged_background_left: observable,
            dragged_background_top: observable,
            drop_zone_background: observable,
            pointer_events_none_cls: computed,
            cursor_default_cls: computed,
            insert_drop_zone: action,
            remove_drop_zone: action,
            create_drop_zone: action,
            start_drag: action,
            stop_drag: action,
            drop: action,
            set_dragged_background_position: action,
        });
    }

    private drag_direction: string = 'right';
    public drop_zone_insert_direction: string = 'right';
    private mouse_is_down: boolean = false;
    private dragging_background: boolean = false;
    public show_dragged_background: boolean = false;
    public lock_background_selection: boolean = false;
    private initial_x: number = 0;
    private initial_y: number = 0;
    private current_x: number = 0;
    private drag_threshold: number = 10;
    private dragged_background_offset: number = 7;
    public dragged_background_left: number = 0;
    public dragged_background_top: number = 0;
    public background_to_move: i_db.Background | undefined;
    private hovering_over_background: i_db.Background | undefined;
    public drop_zone_background: i_db.Background | undefined = undefined;

    public get pointer_events_none_cls() {
        return this.dragging_background ? 'pointer_events_none' : '';
    }

    public get cursor_default_cls() {
        return this.dragging_background ? 'cursor_default' : '';
    }

    public dragged_cls = ({ dragged }: { dragged: boolean }): string =>
        err(() => (dragged ? 'dragged' : ''), 'cnt_66347');

    public dragged_background_dim = ({ dim }: { dim: 'width' | 'height' }): number =>
        err(() => {
            if (n(this.background_to_move)) {
                return this.background_to_move.type.includes('color')
                    ? s_backgrounds.Thumbnail.i().height
                    : (this.background_to_move as any)[`thumbnail_${dim}`];
            }

            return 0;
        }, 'cnt_75467');

    private insert_drop_zone = (): void =>
        err(() => {
            if (
                n(this.show_dragged_background) &&
                n(this.drop_zone_background) &&
                n(this.background_to_move)
            ) {
                this.remove_drop_zone();

                const i_of_drop_zone_background: number =
                    d_backgrounds.CurrentBackground.i().find_i_of_background_with_id({
                        id: this.drop_zone_background.id,
                    });
                const insertion_i =
                    this.drop_zone_insert_direction === 'right'
                        ? i_of_drop_zone_background + 1
                        : i_of_drop_zone_background;
                const drop_zone: i_db.DropZone = {
                    type: 'drop_zone',
                    width: s_backgrounds.Thumbnail.i().get_background_thumbnail_width({
                        background: this.background_to_move,
                    }),
                };
                d_backgrounds.Main.i().backgrounds = x.insert_item(
                    insertion_i,
                    [drop_zone],
                    d_backgrounds.Main.i().backgrounds,
                );
            }
        }, 'cnt_65435');

    private remove_drop_zone = (): void =>
        err(() => {
            (d_backgrounds.Main.i().backgrounds as any) = _.reject(
                d_backgrounds.Main.i().backgrounds,
                (background: i_db.DropZone): boolean => background.type === 'drop_zone',
            );
        }, 'cnt_86466');

    public start_drag = (
        { background_to_move }: { background_to_move: i_db.Background },
        e: MouseEvent,
    ): void =>
        err(() => {
            this.mouse_is_down = true;
            this.background_to_move = background_to_move;

            this.initial_x = e.clientX;
            this.initial_y = e.clientY;
        }, 'cnt_53643');

    public stop_drag = (): Promise<void> =>
        err_async(async () => {
            this.mouse_is_down = false;
            this.dragging_background = false;
            this.show_dragged_background = false;

            this.remove_drop_zone();

            await x.delay(100);

            this.lock_background_selection = false;
        }, 'cnt_53643');

    public drop = async (): Promise<void> =>
        err_async(async () => {
            this.remove_drop_zone();

            if (n(this.background_to_move) && n(this.drop_zone_background)) {
                const background_to_move_i: number =
                    d_backgrounds.CurrentBackground.i().find_i_of_background_with_id({
                        id: this.background_to_move.id,
                    });
                const drop_zone_background_i: number =
                    d_backgrounds.CurrentBackground.i().find_i_of_background_with_id({
                        id: this.drop_zone_background.id,
                    });
                let updated_backgrounds: i_db.Background[] = [];

                const move_dragged_background = ({
                    drop_zone_insert_direction,
                    modifier,
                }: {
                    drop_zone_insert_direction: 'left' | 'right';
                    modifier: number;
                }): void =>
                    err(() => {
                        if (this.drop_zone_insert_direction === drop_zone_insert_direction) {
                            const drop_zone_background_left_i: number =
                                d_backgrounds.CurrentBackground.i().find_i_of_background_with_id({
                                    id: d_backgrounds.Main.i().backgrounds[
                                        drop_zone_background_i + modifier
                                    ].id,
                                });

                            d_backgrounds.Main.i().backgrounds[background_to_move_i].i =
                                d_backgrounds.Main.i().backgrounds[drop_zone_background_left_i].i;
                        } else if (n(this.drop_zone_background)) {
                            d_backgrounds.Main.i().backgrounds[background_to_move_i].i =
                                this.drop_zone_background.i;
                        }
                    }, 'cnt_54680');

                const shift_adjacent_backgrounds = ({
                    backgrounds_to_update_is,
                    modifier,
                }: {
                    backgrounds_to_update_is: number[];
                    modifier: number;
                }): void =>
                    err(() => {
                        updated_backgrounds = backgrounds_to_update_is.map(
                            (i: number): i_db.Background =>
                                err(() => {
                                    d_backgrounds.Main.i().backgrounds[i].i =
                                        d_backgrounds.Main.i().backgrounds[i].i + modifier;

                                    return d_backgrounds.Main.i().backgrounds[i];
                                }, 'cnt_64324'),
                        );
                    }, 'cnt_54329');

                if (background_to_move_i < drop_zone_background_i) {
                    move_dragged_background({ drop_zone_insert_direction: 'left', modifier: -1 });

                    const backgrounds_to_update_is = x.range_arr(
                        background_to_move_i + 1,
                        drop_zone_background_i +
                            (this.drop_zone_insert_direction === 'left' ? -1 : 0),
                    );

                    shift_adjacent_backgrounds({ backgrounds_to_update_is, modifier: -1 });
                } else if (background_to_move_i > drop_zone_background_i) {
                    move_dragged_background({ drop_zone_insert_direction: 'right', modifier: 1 });

                    const backgrounds_to_update_is = x.range_arr(
                        drop_zone_background_i +
                            (this.drop_zone_insert_direction === 'right' ? 1 : 0),
                        background_to_move_i - 1,
                    );

                    shift_adjacent_backgrounds({ backgrounds_to_update_is, modifier: 1 });
                }

                updated_backgrounds.push(d_backgrounds.Main.i().backgrounds[background_to_move_i]);

                d_backgrounds.Main.i().sort_backgrounds();

                d_backgrounds.CurrentBackground.i().set_current_background_i();

                await s_db.Manipulation.i().update_backgrounds({
                    backgrounds: updated_backgrounds,
                });
            }
        }, 'cnt_64325');

    public create_drop_zone = (
        { background_hovering_over }: { background_hovering_over: i_db.Background },
        e: MouseEvent,
    ): void =>
        err(() => {
            const drag_threshold_surpassed: boolean =
                this.mouse_is_down &&
                (e.clientX - this.initial_x >= this.drag_threshold ||
                    e.clientX - this.initial_x <= -this.drag_threshold ||
                    e.clientY - this.initial_y >= this.drag_threshold ||
                    e.clientY - this.initial_y <= -this.drag_threshold);

            if (drag_threshold_surpassed || this.dragging_background) {
                this.dragging_background = true;
                this.lock_background_selection = true;
                this.hovering_over_background = background_hovering_over;

                const moved_mouse_right = this.current_x < e.clientX;
                const moved_mouse_left = this.current_x > e.clientX;
                const stayed_at_the_same_coords = this.current_x === e.clientX;

                if (moved_mouse_right || stayed_at_the_same_coords) {
                    this.drag_direction = 'right';
                } else if (moved_mouse_left) {
                    this.drag_direction = 'left';
                }

                this.get_drop_zone_background();
                this.insert_drop_zone();

                this.current_x = e.clientX;
            }
        }, 'cnt_74357');

    public get_drop_zone_background = (): void =>
        err(() => {
            if (n(this.hovering_over_background) && n(this.background_to_move)) {
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
                        if (n(this.background_to_move) && n(this.hovering_over_background)) {
                            if (this.background_to_move.id === this.hovering_over_background.id) {
                                this.drop_zone_insert_direction = this.drag_direction;
                                this.drop_zone_background =
                                    backgrounds[i_of_background_to_move + i_modifier_1];
                            } else if (
                                n(backgrounds[i_of_background_to_move + i_modifier_2]) &&
                                this.hovering_over_background.id ===
                                    backgrounds[i_of_background_to_move + i_modifier_2].id
                            ) {
                                if (n(backgrounds[i_of_background_to_move + i_modifier_1])) {
                                    this.drop_zone_insert_direction = this.drag_direction;
                                    this.drop_zone_background =
                                        backgrounds[i_of_background_to_move + i_modifier_1];
                                } else {
                                    this.drop_zone_insert_direction = drop_zone_insert_direction;
                                    this.drop_zone_background = this.hovering_over_background;
                                }
                            } else {
                                this.drop_zone_insert_direction = this.drag_direction;
                                this.drop_zone_background = this.hovering_over_background;
                            }
                        }
                    }, 'cnt_64684');

                const i_of_background_to_move: number =
                    d_backgrounds.CurrentBackground.i().find_i_of_background_with_id({
                        id: this.background_to_move.id,
                    });
                const backgrounds: i_db.Background[] = toJS(d_backgrounds.Main.i().backgrounds);

                const only_one_background_exist = d_backgrounds.Main.i().backgrounds.length === 1;
                const dragging_first_background_over_first_background =
                    this.background_to_move.id === this.hovering_over_background.id &&
                    this.background_to_move.id === backgrounds[0].id;
                const dragging_last_background_over_last_background =
                    this.background_to_move.id === this.hovering_over_background.id &&
                    this.background_to_move.id === backgrounds[backgrounds.length - 1].id;

                if (only_one_background_exist) {
                    this.drop_zone_background = undefined;
                } else if (dragging_first_background_over_first_background) {
                    this.drop_zone_insert_direction = 'right';
                    // eslint-disable-next-line prefer-destructuring
                    this.drop_zone_background = backgrounds[1];
                } else if (dragging_last_background_over_last_background) {
                    this.drop_zone_insert_direction = 'left';

                    this.drop_zone_background = backgrounds[backgrounds.length - 2];
                } else if (this.drag_direction === 'right') {
                    get_drop_zone_background_inner({
                        drop_zone_insert_direction: 'left',
                        i_modifier_1: 1,
                        i_modifier_2: -1,
                    });
                } else if (this.drag_direction === 'left') {
                    get_drop_zone_background_inner({
                        drop_zone_insert_direction: 'right',
                        i_modifier_1: -1,
                        i_modifier_2: 1,
                    });
                }
            }
        }, 'cnt_64781');

    public set_dragged_background_position = (e: MouseEvent): void =>
        err(() => {
            if (this.dragging_background && n(this.background_to_move)) {
                this.show_dragged_background = true;

                this.dragged_background_top = e.clientY + this.dragged_background_offset;
                this.dragged_background_left =
                    e.clientX -
                    s_backgrounds.Thumbnail.i().get_background_thumbnail_width({
                        background: this.background_to_move,
                    }) -
                    this.dragged_background_offset;
            }
        }, 'cnt_54674');
}
