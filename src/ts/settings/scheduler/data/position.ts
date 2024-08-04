import { makeObservable, observable, action } from 'mobx';

import { vars } from 'shared_clean/internal';

export class Position {
    private static i0: Position;

    public static i(): Position {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    private constructor() {
        makeObservable(this, {
            left: observable,
            set_left: action,
        });
    }

    public left: number = 0;

    public set_left = (): void =>
        err(() => {
            const section = s<HTMLDivElement>('.section');
            const section_content = s<HTMLDivElement>('.section_content');

            if (n(section) && n(section_content)) {
                const section_rect: DOMRect = section.getBoundingClientRect();
                const section_content_padding: number = x.get_numeric_css_val(
                    section_content,
                    'padding',
                );

                this.left = section_rect.left + section_content_padding + vars.border_width;
            }
        }, 'cnt_1235');
}
