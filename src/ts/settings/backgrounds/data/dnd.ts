import reject from 'lodash/reject';
import isInteger from 'lodash/isInteger';
import { MouseEvent } from 'react';
import { makeObservable, action } from 'mobx';

import { s_i, i_db } from 'shared_clean/internal';
import { d_backgrounds, d_pagination, d_dnd, s_backgrounds } from 'settings/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {
        makeObservable<Class, 'remove_drop_zone'>(this, {
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
            if (n(d_dnd.Dnd.item_to_move)) {
                return (d_dnd.Dnd.item_to_move! as i_db.Background).type.includes('color')
                    ? s_backgrounds.Thumbnail.height
                    : (d_dnd.Dnd.item_to_move as any)[`thumbnail_${dim}`];
            }

            return 0;
        }, 'cnt_1119');

    public remove_drop_zone = (): void =>
        err(() => {
            (d_pagination.Page.page_backgrounds as any) = reject(
                d_pagination.Page.page_backgrounds,
                (background: i_db.BackgroundDropZone): boolean => background.type === 'drop_zone',
            );
        }, 'cnt_1120');

    public start_drag = (
        { background_to_move }: { background_to_move: i_db.Background },
        e: MouseEvent,
    ): void =>
        err(() => {
            d_dnd.Dnd.drag_type = 'background';
            d_dnd.Dnd.mouse_is_down = true;
            d_dnd.Dnd.item_to_move = background_to_move;

            d_dnd.Dnd.initial_x = e.clientX;
            d_dnd.Dnd.initial_y = e.clientY;

            d_dnd.Dnd.item_to_move_i = s_i.I.find_i_of_item_with_id({
                id: d_dnd.Dnd.item_to_move!.id,
                items: d_pagination.Page.page_backgrounds,
            });
        }, 'cnt_1121');

    public stop_drag = (): Promise<void> =>
        err_async(async () => {
            await d_dnd.Dnd.stop_drag({ remove_drop_zone: this.remove_drop_zone });

            this.lock_background_selection = false;
        }, 'cnt_1122');

    public create_drop_zone = (
        { hovering_over_background }: { hovering_over_background: i_db.Background },
        e: MouseEvent,
    ): void =>
        err(() => {
            const drag_threshold_surpassed: boolean = d_dnd.Dnd.drag_threshold_surpassed({
                e,
            });

            if (
                d_dnd.Dnd.drag_type === 'background' &&
                (drag_threshold_surpassed || d_dnd.Dnd.dragging_item)
            ) {
                d_dnd.Dnd.dragging_item = true;
                this.lock_background_selection = true;
                d_dnd.Dnd.hovering_over_item = hovering_over_background;

                d_dnd.Dnd.set_drag_direction(e);
                d_dnd.Dnd.get_drop_zone_item({
                    items: d_pagination.Page.page_backgrounds,
                });
                d_dnd.Dnd.insert_drop_zone();
            }
        }, 'cnt_1123');

    public move_by_move_btn = ({ background }: { background: i_db.Background }): void =>
        err(() => {
            d_dnd.Dnd.item_to_move = background;
            d_dnd.Dnd.item_to_move_i = s_i.I.find_i_of_item_with_id({
                id: d_dnd.Dnd.item_to_move!.id,
                items: d_backgrounds.Backgrounds.backgrounds,
            });

            // eslint-disable-next-line no-alert
            const val: string | null = globalThis.prompt(ext.msg('enter_new_background_no_prompt'));

            if (n(val)) {
                const val_2: number = +val;
                const val_is_integer: boolean = isInteger(val_2);

                if (val_is_integer) {
                    const last_background_i: number =
                        d_backgrounds.Backgrounds.backgrounds.length - 1;
                    let drop_i: number = 0;
                    d_dnd.Dnd.drop_zone_insert_direction = 'left';

                    if (val_2 > 0 && val_2 <= last_background_i) {
                        drop_i = val_2 - 1;
                        if (val_2 < d_dnd.Dnd.item_to_move_i) {
                            d_dnd.Dnd.drop_zone_insert_direction = 'left';
                        } else if (val_2 > d_dnd.Dnd.item_to_move_i) {
                            d_dnd.Dnd.drop_zone_insert_direction = 'right';
                        }
                    } else if (val_2 > last_background_i) {
                        d_dnd.Dnd.drop_zone_insert_direction = 'right';

                        drop_i = last_background_i;
                    }

                    d_dnd.Dnd.drop_zone_item = d_backgrounds.Backgrounds.backgrounds[drop_i];

                    if (val_2 - 1 !== d_dnd.Dnd.item_to_move_i) {
                        d_dnd.Dnd.drop();
                    }
                }
            }
        }, 'cnt_1124');
}

export const Dnd = Class.get_instance();
