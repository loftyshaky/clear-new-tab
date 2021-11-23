import { makeObservable, observable, action } from 'mobx';

import { s_viewport } from '@loftyshaky/shared';
import { vars } from 'shared/internal';
import { d_backgrounds } from 'settings/internal';

export class VirtualizedList {
    private static i0: VirtualizedList;

    public static i(): VirtualizedList {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
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
            const section_content = s<HTMLDivElement>('.section_content');

            if (n(section_content)) {
                const gap: number = x.get_numeric_css_val(section_content, 'padding');
                const gap_and_borders_width: number = gap + vars.border_width * 2;

                const backgrounds_section_content = s<HTMLDivElement>(
                    '.backgrounds .section_content',
                );

                if (!n(this.position_map[index])) {
                    this.position_map[index] = {};
                }

                if (n(this.position_map[index - 1]) && n(backgrounds_section_content)) {
                    const section_content_rect: DOMRect =
                        backgrounds_section_content.getBoundingClientRect();

                    this.position_map[index].x =
                        this.position_map[index - 1].x +
                        d_backgrounds.Main.i().backgrounds[index - 1].thumbnail_width +
                        gap_and_borders_width;

                    if (
                        this.position_map[index].x +
                            d_backgrounds.Main.i().backgrounds[index].thumbnail_width +
                            vars.scrollbar_width +
                            gap +
                            vars.border_width +
                            section_content_rect.left >=
                        section_content_rect.right
                    ) {
                        this.position_map[index].x = gap;

                        this.position_map[index].y =
                            this.position_map[index - 1].y +
                            d_backgrounds.Main.i().backgrounds[index - 1].thumbnail_height +
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
            }

            return {
                width: d_backgrounds.Main.i().backgrounds[index].thumbnail_width,
                height: d_backgrounds.Main.i().backgrounds[index].thumbnail_height,
                x: this.position_map[index].x,
                y: this.position_map[index].y,
            };
        }, 'cnt_73925');

    public calculate_height = (): void =>
        err(() => {
            this.height = s_viewport.Main.i().get_dim({ dim: 'height' }) - 76;
        }, 'cnt_57843');
}
