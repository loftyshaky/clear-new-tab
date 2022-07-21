import _ from 'lodash';
import { MouseEvent } from 'react';
import { makeObservable, action } from 'mobx';

import { s_i, i_db } from 'shared/internal';
import { d_backgrounds, d_dnd, s_backgrounds } from 'settings/internal';

export class Dnd {
    private static i0: Dnd;

    public static i(): Dnd {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    private constructor() {
        makeObservable<Dnd, 'remove_drop_zone'>(this, {
            remove_drop_zone: action,
            create_drop_zone: action,
            start_drag: action,
            move_by_move_btn: action,
        });
    }

    public collection_ref: any;
    public lock_background_selection: boolean = false;
    public background_to_move: i_db.Background | undefined;

    public dragged_background_dim = ({ dim }: { dim: 'width' | 'height' }): number =>
        err(() => {
            if (n(d_dnd.Main.i().item_to_move)) {
                return (d_dnd.Main.i().item_to_move! as i_db.Background).type.includes('color')
                    ? s_backgrounds.Thumbnail.i().height
                    : (d_dnd.Main.i().item_to_move as any)[`thumbnail_${dim}`];
            }

            return 0;
        }, 'cnt_1119');

    public remove_drop_zone = (): void =>
        err(() => {
            (d_backgrounds.Main.i().backgrounds as any) = _.reject(
                d_backgrounds.Main.i().backgrounds,
                (background: i_db.BackgroundDropZone): boolean => background.type === 'drop_zone',
            );
        }, 'cnt_1120');

    public start_drag = (
        { background_to_move }: { background_to_move: i_db.Background },
        e: MouseEvent,
    ): void =>
        err(() => {
            d_dnd.Main.i().drag_type = 'background';
            d_dnd.Main.i().mouse_is_down = true;
            d_dnd.Main.i().item_to_move = background_to_move;

            d_dnd.Main.i().initial_x = e.clientX;
            d_dnd.Main.i().initial_y = e.clientY;

            d_dnd.Main.i().item_to_move_i = s_i.Main.i().find_i_of_item_with_id({
                id: d_dnd.Main.i().item_to_move!.id,
                items: d_backgrounds.Main.i().backgrounds,
            });
        }, 'cnt_1121');

    public stop_drag = (): Promise<void> =>
        err_async(async () => {
            await d_dnd.Main.i().stop_drag({ remove_drop_zone: this.remove_drop_zone });

            this.lock_background_selection = false;
        }, 'cnt_1122');

    public create_drop_zone = (
        { hovering_over_background }: { hovering_over_background: i_db.Background },
        e: MouseEvent,
    ): void =>
        err(() => {
            const drag_threshold_surpassed: boolean = d_dnd.Main.i().drag_threshold_surpassed({
                e,
            });

            if (
                d_dnd.Main.i().drag_type === 'background' &&
                (drag_threshold_surpassed || d_dnd.Main.i().dragging_item)
            ) {
                d_dnd.Main.i().dragging_item = true;
                this.lock_background_selection = true;
                d_dnd.Main.i().hovering_over_item = hovering_over_background;

                d_dnd.Main.i().set_drag_direction(e);
                d_dnd.Main.i().get_drop_zone_item({
                    items: d_backgrounds.Main.i().backgrounds,
                });
                d_dnd.Main.i().insert_drop_zone();
            }
        }, 'cnt_1123');

    public move_by_move_btn = ({ background }: { background: i_db.Background }): void =>
        err(() => {
            d_dnd.Main.i().item_to_move = background;

            // eslint-disable-next-line no-alert
            const val: string | null = globalThis.prompt(ext.msg('enter_new_background_no_prompt'));

            if (n(val)) {
                const val_2: number = +val;
                const val_is_integer: boolean = _.isInteger(val_2);

                if (val_is_integer) {
                    const last_background_i: number = d_backgrounds.Main.i().backgrounds.length - 1;
                    let drop_i: number = 0;
                    d_dnd.Main.i().drop_zone_insert_direction = 'left';

                    if (val_2 > 0 && val_2 <= last_background_i) {
                        drop_i = val_2 - 1;
                        if (val_2 < d_dnd.Main.i().item_to_move_i) {
                            d_dnd.Main.i().drop_zone_insert_direction = 'left';
                        } else if (val_2 > d_dnd.Main.i().item_to_move_i) {
                            d_dnd.Main.i().drop_zone_insert_direction = 'right';
                        }
                    } else if (val_2 > last_background_i) {
                        d_dnd.Main.i().drop_zone_insert_direction = 'right';

                        drop_i = last_background_i;
                    }

                    d_dnd.Main.i().drop_zone_item = d_backgrounds.Main.i().backgrounds[drop_i];

                    if (val_2 - 1 !== d_dnd.Main.i().item_to_move_i) {
                        d_dnd.Main.i().drop();
                    }
                }
            }
        }, 'cnt_1124');
}
