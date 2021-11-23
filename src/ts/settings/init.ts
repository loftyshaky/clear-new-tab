import { d_color, s_color } from '@loftyshaky/shared/inputs';
import { d_sections } from 'settings/internal';

export const init = (): void =>
    err(() => {
        d_sections.Main.i().init_options();
        d_sections.Main.i().init_sections();

        x.bind(window, 'resize', d_sections.Width.i().set_backgrounds_section_width);
        x.bind(window, 'scroll', s_color.Position.i().set);
        x.bind(document, 'mousedown', d_color.Visibility.i().hide_all);
    }, 'cnt_1125');
