import { d_inputs, d_color, s_color } from '@loftyshaky/shared/inputs';
import { d_data } from 'shared_clean/internal';
import { InitAll, s_preload_color } from 'shared/internal';
import {
    d_background_settings,
    d_backgrounds,
    d_browser_theme,
    d_custom_code,
    d_dnd,
    d_optional_permission_settings,
    d_pagination,
    d_scheduler,
    d_sections,
} from 'settings/internal';

export const init = (): Promise<void> =>
    err_async(async () => {
        await InitAll.init();
        d_inputs.InputWidth.set_min_and_max_width({ min_width: 323 });
        d_data.Ui.create_ui_objs();
        d_sections.Options.init();
        d_sections.Sections.init();
        d_scheduler.TopControls.init();
        d_custom_code.TopControls.init();
        d_scheduler.DatePicker.init_options();
        d_scheduler.DatePicker.init_inputs();
        await d_backgrounds.Backgrounds.set_backgrounds();
        await d_pagination.Pagination.set_total_backgrounds();
        await d_pagination.Page.set_backgrounds_per_page_val();
        d_pagination.Pagination.on_backgrounds_reaction();
        d_pagination.Page.on_page_reaction();
        d_pagination.Page.on_page_backgrounds_autorun();
        d_pagination.Page.on_backgrounds_per_page_reaction();
        d_scheduler.Tasks.set_tasks();
        d_custom_code.CustomCode.set_custom_code();
        d_backgrounds.CurrentBackground.set_current_background_i();
        d_background_settings.GlobalCheckboxes.set_ui_vals();
        d_background_settings.SettingsContext.react_to_global_selection();
        d_optional_permission_settings.Ui.set_ui_vals();
        s_preload_color.Storage.set_preload_color();
        d_browser_theme.SideEffects.change_into_uploading_state();

        x.bind(window, 'resize', d_sections.Width.set_backgrounds_section_width);
        x.bind(window, 'scroll', s_color.Position.set);
        x.bind(window, 'resize', s_color.Position.set);
        x.bind(window, 'resize', d_scheduler.Position.set_left);
        x.bind(window, 'resize', d_backgrounds.Scrollable.calculate_height);
        x.bind(document, 'mousedown', d_color.Visibility.hide_all);
        x.bind(document, 'mousemove', d_dnd.Dnd.set_dragged_item_position);
        x.bind(document, 'mouseup', d_backgrounds.Dnd.stop_drag);
        x.bind(document, 'mouseup', d_scheduler.TaskDnd.stop_drag);
        x.bind(document, 'click', d_backgrounds.Actions.hide);

        InitAll.render_settings();
    }, 'cnt_1221');
