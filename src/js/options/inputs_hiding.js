import { toJS, runInAction, configure } from 'mobx';

import { db } from 'js/init_db';
import * as file_types from 'js/file_types';
import * as contains_permission from 'js/contains_permission';
import * as inapp from 'js/inapp';
import { inputs_data } from 'options/inputs_data';
import * as background_selection from 'options/background_selection';

configure({ enforceActions: 'observed' });

export const decide_what_inputs_to_hide = async () => {
    try {
        const ed_all = await eda();
        const selected_background = await db.backgroundsd.get(background_selection.mut.selected_background_id || 1) || 'none';

        runInAction(() => {
            inputs_data.obj.upload.load_theme_background.visible = env.what_browser === 'chrome' && ed_all.mode === 'theme';
            inputs_data.obj.background_settings.keep_old_themes_backgrounds.visible = ed_all.mode === 'theme';
            inputs_data.obj.background_settings.slideshow.visible = !!(ed_all.mode === 'multiple' || ed_all.mode === 'random_solid_color');
            inputs_data.obj.background_settings.shuffle.visible = ed_all.mode === 'multiple';
            inputs_data.obj.background_settings.change_interval.visible = !!(ed_all.mode === 'multiple' || ed_all.mode === 'random_solid_color');
            inputs_data.obj.background_settings.background_change_effect.visible = !!((ed_all.mode === 'multiple' || ed_all.mode === 'random_solid_color') && ed_all.slideshow);
            inputs_data.obj.background_settings.slide_direction.visible = !!((ed_all.mode === 'multiple' || ed_all.mode === 'random_solid_color') && ed_all.slideshow && ed_all.background_change_effect === 'slide');
            inputs_data.obj.background_settings.current_background.visible = !!(ed_all.mode === 'one' || ed_all.mode === 'multiple');
            inputs_data.obj.background_settings.set_last_uploaded.visible = !!(ed_all.mode === 'one' || ed_all.mode === 'multiple');
            inputs_data.obj.background_settings.repeat.visible = selected_background === 'none' ? true : file_types.con.types[selected_background.type] !== 'video_files';
            inputs_data.obj.background_settings.video_volume.visible = selected_background === 'none' ? true : file_types.con.types[selected_background.type] === 'video_files';
        });

        const allow_downloading_imgs_by_link_enabled = ed_all.allow_downloading_imgs_by_link && await contains_permission.contains_permission(toJS(inputs_data.obj.other_settings.allow_downloading_imgs_by_link.permissions));
        const enable_paste_enabled = ed_all.enable_paste && await contains_permission.contains_permission(toJS(inputs_data.obj.other_settings.enable_paste.permissions));

        runInAction(() => {
            inputs_data.obj.upload.download_img_when_link_given.visible = !!allow_downloading_imgs_by_link_enabled;
            inputs_data.obj.upload.paste.adjacent_btn_is_visible = !!enable_paste_enabled;
        });

        if (!mut.run_decide_what_inputs_to_hide_once) {
            mut.run_decide_what_inputs_to_hide_once = true;

            if (env.what_browser !== 'firefox') {
                inapp.refresh_purchase_state(false);
            }
        }

    } catch (er) {
        err(er, 270);
    }
};

const mut = {
    run_decide_what_inputs_to_hide_once: false,
};
