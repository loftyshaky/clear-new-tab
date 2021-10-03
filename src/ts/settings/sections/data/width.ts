import _ from 'lodash';

import { s_viewport } from '@loftyshaky/shared';

export class Width {
    private static i0: Width;

    public static i(): Width {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    private set_settings_section_width = (): void =>
        err(() => {
            const section_els = sa<HTMLDivElement>('.sections.settings .section');

            if (n(section_els)) {
                const max_width_section_el: HTMLDivElement | undefined = _.maxBy(
                    section_els,
                    (section_el: HTMLDivElement): number => section_el.offsetWidth,
                );

                if (n(max_width_section_el)) {
                    const max_width_section_val: number = max_width_section_el.offsetWidth;

                    [...section_els].forEach((section_el: HTMLDivElement): void =>
                        err(() => {
                            section_el.style.width = `${max_width_section_val}px`;
                        }, 'cnt_99999'),
                    );
                }
            }
        }, 'cnt_99999');

    public set_imgs_section_width = (): void =>
        err(() => {
            const viewport_width = s_viewport.Main.i().get_dim({ dim: 'width' });
            const settings_sections_el = s<HTMLDivElement>('.sections.settings');
            const imgs_sections_el = s<HTMLDivElement>('.sections.imgs');
            const imgs_section_el = s<HTMLDivElement>('.section.imgs');

            if (n(settings_sections_el) && n(imgs_sections_el) && n(imgs_section_el)) {
                const outer_margin = x.get_numeric_css_val(imgs_section_el, 'margin-top');
                const imgs_sections_el_max_width = x.get_numeric_css_val(
                    imgs_sections_el,
                    'max-width',
                );
                const settings_sections_el_width = settings_sections_el.offsetWidth;
                const new_width: number =
                    viewport_width - settings_sections_el_width - outer_margin;

                if (new_width <= imgs_sections_el_max_width) {
                    imgs_sections_el.style.width = `${new_width + outer_margin + 2}px`;
                    imgs_section_el.style.width = `${new_width - 2}px`;
                } else {
                    imgs_sections_el.style.width = '';
                    imgs_section_el.style.width = '';
                }
            }
        }, 'cnt_99999');

    public set = (): void =>
        err(() => {
            this.set_settings_section_width();
            this.set_imgs_section_width();
        }, 'cnt_99999');
}
