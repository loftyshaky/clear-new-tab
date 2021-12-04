import { d_color, s_color } from '@loftyshaky/shared/inputs';
import { d_backgrounds, d_sections } from 'settings/internal';

export const init = (): Promise<void> =>
    err_async(async () => {
        d_sections.Main.i().init_options();
        d_sections.Main.i().init_sections();
        await d_backgrounds.Main.i().set_backgrounds();
        d_backgrounds.CurrentBackground.i().set_current_background_id_input_val();

        x.bind(window, 'resize', d_sections.Width.i().set_backgrounds_section_width);
        x.bind(window, 'scroll', s_color.Position.i().set);
        x.bind(document, 'mousedown', d_color.Visibility.i().hide_all);
    }, 'cnt_1125');
