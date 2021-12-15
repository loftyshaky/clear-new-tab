import { d_color, s_color } from '@loftyshaky/shared/inputs';
import { d_data } from 'shared/internal';
import { d_background_settings, d_backgrounds, d_sections } from 'settings/internal';

export const init = (): Promise<void> =>
    err_async(async () => {
        d_data.Main.i().create_objs();
        d_sections.Main.i().init_options();
        d_sections.Main.i().init_sections();
        await d_backgrounds.Main.i().set_backgrounds();
        d_backgrounds.CurrentBackground.i().set_current_background_i();
        d_background_settings.GlobalCheckboxes.i().set_ui_values();
        d_background_settings.SettingsType.i().react_to_global_selection();

        x.bind(window, 'resize', d_sections.Width.i().set_backgrounds_section_width);
        x.bind(window, 'scroll', s_color.Position.i().set);
        x.bind(document, 'mousedown', d_color.Visibility.i().hide_all);
        x.bind(document, 'mousemove', d_backgrounds.Dnd.i().set_dragged_background_position);
        x.bind(document, 'mouseup', d_backgrounds.Dnd.i().stop_drag);
    }, 'cnt_1125');
