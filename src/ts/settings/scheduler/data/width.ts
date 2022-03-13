import { makeObservable, computed } from 'mobx';

import { d_sections } from 'settings/internal';

export class Width {
    private static i0: Width;

    public static i(): Width {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    private constructor() {
        makeObservable(this, {
            width: computed,
        });
    }

    public get width() {
        // eslint-disable-next-line no-unused-expressions
        d_sections.Width.i().settings_section_width;

        const section_content = s<HTMLDivElement>('.section_content');

        if (n(section_content)) {
            const section_content_padding: number = x.get_numeric_css_val(
                section_content,
                'padding',
            );

            return d_sections.Width.i().settings_section_width - section_content_padding * 4;
        }

        return 0;
    }
}
