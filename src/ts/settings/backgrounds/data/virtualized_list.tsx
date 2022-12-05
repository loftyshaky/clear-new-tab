import { makeObservable, observable, action } from 'mobx';

import { s_viewport } from '@loftyshaky/shared';
import { vars, i_db } from 'shared/internal';
import { d_backgrounds, s_backgrounds } from 'settings/internal';

export class VirtualizedList {
    private static i0: VirtualizedList;

    public static i(): VirtualizedList {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    private constructor() {
        makeObservable(this, {
            width: observable,
            height: observable,
            calculate_height: action,
        });
    }

    public width: number = 0;
    public height: number = 0;
    private position_map: any[] = [];

    public cell_size_and_position_getter = ({
        index,
    }: {
        index: number;
    }): { height: number; width: number; x: number; y: number } =>
        err(() => {
            let thumbnail_width: number = 0;
            let thumbnail_height: number = 0;
            let previous_thumbnail_width: number = 0;
            let previous_thumbnail_height: number = 0;
            const gap: number = s_backgrounds.CssVals.i().get_gap();
            const gap_and_borders_width: number = gap + vars.border_width * 2;
            const backgrounds_section_content = s<HTMLDivElement>('.backgrounds .section_content');

            if (d_backgrounds.Main.i().backgrounds[index].type.includes('color')) {
                thumbnail_width = s_backgrounds.Thumbnail.i().height;
                thumbnail_height = s_backgrounds.Thumbnail.i().height;
            } else if ((d_backgrounds.Main.i().backgrounds as any)[index].type === 'drop_zone') {
                thumbnail_width = d_backgrounds.Main.i().backgrounds[index].type.includes('color')
                    ? s_backgrounds.Thumbnail.i().height
                    : (d_backgrounds.Main.i().backgrounds[index] as i_db.BackgroundDropZone).width;
                thumbnail_height = s_backgrounds.Thumbnail.i().height;
            } else {
                thumbnail_width = (d_backgrounds.Main.i().backgrounds[index] as i_db.FileBackground)
                    .thumbnail_width;
                thumbnail_height = (
                    d_backgrounds.Main.i().backgrounds[index] as i_db.FileBackground
                ).thumbnail_height;
            }

            if (n(d_backgrounds.Main.i().backgrounds[index - 1])) {
                if (d_backgrounds.Main.i().backgrounds[index - 1].type.includes('color')) {
                    previous_thumbnail_width = s_backgrounds.Thumbnail.i().height;
                    previous_thumbnail_height = s_backgrounds.Thumbnail.i().height;
                } else if (
                    (d_backgrounds.Main.i().backgrounds as any)[index - 1].type === 'drop_zone'
                ) {
                    previous_thumbnail_width = d_backgrounds.Main.i().backgrounds[
                        index - 1
                    ].type.includes('color')
                        ? s_backgrounds.Thumbnail.i().height
                        : (d_backgrounds.Main.i().backgrounds[index - 1] as i_db.BackgroundDropZone)
                              .width;
                    previous_thumbnail_height = s_backgrounds.Thumbnail.i().height;
                } else {
                    previous_thumbnail_width = (
                        d_backgrounds.Main.i().backgrounds[index - 1] as i_db.FileBackground
                    ).thumbnail_width;
                    previous_thumbnail_height = (
                        d_backgrounds.Main.i().backgrounds[index - 1] as i_db.FileBackground
                    ).thumbnail_height;
                }
            }

            if (!n(this.position_map[index])) {
                this.position_map[index] = {};
            }

            if (n(this.position_map[index - 1]) && n(backgrounds_section_content)) {
                const section_content_rect: DOMRect =
                    backgrounds_section_content.getBoundingClientRect();

                this.position_map[index].x =
                    this.position_map[index - 1].x +
                    previous_thumbnail_width +
                    gap_and_borders_width;

                if (
                    this.position_map[index].x +
                        thumbnail_width +
                        vars.scrollbar_width +
                        gap +
                        vars.border_width +
                        section_content_rect.left >=
                    section_content_rect.right
                ) {
                    this.position_map[index].x = gap;

                    this.position_map[index].y =
                        this.position_map[index - 1].y +
                        previous_thumbnail_height +
                        gap_and_borders_width;

                    if (!n(this.position_map[index].y)) {
                        this.position_map[index].y = gap;
                    }
                } else {
                    this.position_map[index].y = this.position_map[index - 1].y;
                }
            } else {
                this.position_map[index].x = gap;
                this.position_map[index].y = gap;
            }

            return {
                width: thumbnail_width,
                height: thumbnail_height,
                x: n(this.position_map[index]) ? this.position_map[index].x : 0,
                y: n(this.position_map[index]) ? this.position_map[index].y : 0,
            };
        }, 'cnt_1143');

    public calculate_height = (): void =>
        err(() => {
            const pagination_w_el = s<HTMLDivElement>('.pagination_w');

            if (n(pagination_w_el)) {
                this.height =
                    s_viewport.Main.i().get_dim({ dim: 'height' }) -
                    (pagination_w_el.offsetHeight + 76);
            }
        }, 'cnt_1144');
}
