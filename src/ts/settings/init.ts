import { d_color, s_color } from '@loftyshaky/shared/inputs';
import { InitAll, d_data, s_preload_color } from 'shared/internal';
import {
    d_background_settings,
    d_backgrounds,
    d_custom_code,
    d_dnd,
    d_optional_permission_settings,
    d_scheduler,
    d_sections,
    s_browser_theme,
} from 'settings/internal';

export const init = (): Promise<void> =>
    err_async(async () => {
        InitAll.i().init();
        d_data.Main.i().create_objs();
        d_sections.Main.i().init_options();
        d_sections.Main.i().init_sections();
        d_scheduler.TopControls.i().init();
        d_custom_code.TopControls.i().init();
        d_scheduler.DatePicker.i().init_options();
        d_scheduler.DatePicker.i().init_inputs();
        await d_backgrounds.Main.i().set_backgrounds();
        d_scheduler.Tasks.i().set_tasks();
        d_custom_code.Main.i().set_custom_code();
        d_backgrounds.CurrentBackground.i().set_current_background_i();
        d_background_settings.GlobalCheckboxes.i().set_ui_vals();
        d_background_settings.SettingsContext.i().react_to_global_selection();
        d_optional_permission_settings.Main.i().set_ui_vals();
        s_browser_theme.Main.i().try_to_get_theme_background();
        ext.send_msg({ msg: 'push_options_page_tab_id' });
        s_preload_color.Storage.i().set_preload_color();

        x.bind(window, 'resize', d_sections.Width.i().set_backgrounds_section_width);
        x.bind(window, 'scroll', s_color.Position.i().set);
        x.bind(window, 'resize', s_color.Position.i().set);
        x.bind(window, 'resize', d_scheduler.Position.i().set_left);
        x.bind(document, 'mousedown', d_color.Visibility.i().hide_all);
        x.bind(document, 'mousemove', d_dnd.Main.i().set_dragged_item_position);
        x.bind(document, 'mouseup', d_backgrounds.Dnd.i().stop_drag);
        x.bind(document, 'mouseup', d_scheduler.TaskDnd.i().stop_drag);
        x.bind(document, 'click', d_backgrounds.Actions.i().hide);

        InitAll.i().render_settings();
    }, 'cnt_1221');