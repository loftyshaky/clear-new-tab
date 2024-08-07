import maxBy from 'lodash/maxBy';
import { makeObservable, action, observable } from 'mobx';

import { s_viewport } from '@loftyshaky/shared/shared';
import { vars } from 'shared_clean/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {
        makeObservable<this, 'set_settings_section_width'>(this, {
            settings_section_width: observable,
            set_settings_section_width: action,
            set_backgrounds_section_width: action,
        });
    }

    public settings_section_width: number = 0;

    private set_settings_section_width = (): void =>
        err(() => {
            const section_els = sa<HTMLDivElement>('.sections.settings .section');

            if (n(section_els)) {
                const max_width_section_el: HTMLDivElement | undefined = maxBy(
                    section_els,
                    (section_el: HTMLDivElement): number => section_el.offsetWidth,
                );

                if (n(max_width_section_el)) {
                    this.settings_section_width =
                        max_width_section_el.offsetWidth - vars.border_width * 2;
                    [...section_els].forEach((section_el: HTMLDivElement): void =>
                        err(() => {
                            section_el.style.width = x.px(this.settings_section_width);
                        }, 'cnt_1296'),
                    );
                }
            }
        }, 'cnt_1297');

    public set_backgrounds_section_width = (): void =>
        err(() => {
            const viewport_width = s_viewport.Viewport.get_dim({ dim: 'width' });
            const settings_sections_el = s<HTMLDivElement>('.sections.settings');
            const backgrounds_sections_el = s<HTMLDivElement>('.sections.backgrounds');
            const backgrounds_section_el = s<HTMLDivElement>('.section.backgrounds');

            if (
                n(settings_sections_el) &&
                n(backgrounds_sections_el) &&
                n(backgrounds_section_el)
            ) {
                const outer_margin = x.get_numeric_css_val(backgrounds_section_el, 'margin-top');
                const backgrounds_sections_el_max_width = x.get_numeric_css_val(
                    backgrounds_sections_el,
                    'max-width',
                );
                const settings_sections_el_width = settings_sections_el.offsetWidth;
                const new_width: number =
                    viewport_width - settings_sections_el_width - outer_margin;

                if (new_width <= backgrounds_sections_el_max_width - vars.scrollbar_width) {
                    const backgrounds_section_el_width = new_width - 2;

                    backgrounds_sections_el.style.width = x.px(new_width + outer_margin + 2);
                    backgrounds_section_el.style.width = x.px(backgrounds_section_el_width);
                } else {
                    backgrounds_sections_el.style.width = '';
                    backgrounds_section_el.style.width = '';
                }
            }
        }, 'cnt_1298');

    public set = (): void =>
        err(() => {
            this.set_settings_section_width();
            this.set_backgrounds_section_width();
        }, 'cnt_1299');
}

export const Width = Class.get_instance();
