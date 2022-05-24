import { makeObservable, computed } from 'mobx';

import { d_sections } from 'settings/internal';

export class Dims {
    private static i0: Dims;

    public static i(): Dims {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    private constructor() {
        makeObservable(this, {
            scheduler_width: computed,
        });
    }

    public task_height: number = 83;

    public get task_width() {
        const task = s<HTMLDivElement>('.task');

        if (n(task)) {
            const task_width: number = x.get_numeric_css_val(task, 'width');

            return task_width;
        }

        return 0;
    }

    public get scheduler_width() {
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
