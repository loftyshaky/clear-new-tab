'use_strict';

import { toJS, runInAction, configure } from 'mobx';

import { db } from 'js/init_db';
import * as file_types from 'js/file_types';
import * as contains_permission from 'js/contains_permission';
import { inputs_data } from 'options/inputs_data';
import * as img_selection from 'options/img_selection';

configure({ enforceActions: 'observed' });

export const decide_what_inputs_to_hide = async () => {
    try {
        const ed_all = await eda();
        const selected_img = await db.imgsd.get(img_selection.mut.selected_img_id || 1) || 'none';

        runInAction(() => {
            inputs_data.obj.img_settings.keep_old_themes_imgs.visible = ed_all.mode === 'theme';
            inputs_data.obj.img_settings.slideshow.visible = !!(ed_all.mode === 'multiple' || ed_all.mode === 'random_solid_color');
            inputs_data.obj.img_settings.shuffle.visible = ed_all.mode === 'multiple';
            inputs_data.obj.img_settings.change_interval.visible = !!(ed_all.mode === 'multiple' || ed_all.mode === 'random_solid_color');
            inputs_data.obj.img_settings.img_change_effect.visible = !!((ed_all.mode === 'multiple' || ed_all.mode === 'random_solid_color') && ed_all.slideshow);
            inputs_data.obj.img_settings.slide_direction.visible = !!((ed_all.mode === 'multiple' || ed_all.mode === 'random_solid_color') && ed_all.slideshow && ed_all.img_change_effect === 'slide');
            inputs_data.obj.img_settings.current_img.visible = !!(ed_all.mode === 'one' || ed_all.mode === 'multiple');
            inputs_data.obj.img_settings.set_last_uploaded.visible = !!(ed_all.mode === 'one' || ed_all.mode === 'multiple');
            inputs_data.obj.img_settings.repeat.visible = selected_img === 'none' ? true : file_types.con.types[selected_img.type] !== 'video_files';
            inputs_data.obj.img_settings.video_volume.visible = selected_img === 'none' ? true : file_types.con.types[selected_img.type] === 'video_files';
        });

        const contains_allow_downloading_images_by_link_permission = await contains_permission.contains_permission(toJS(inputs_data.obj.other_settings.allow_downloading_images_by_link.permissions));
        const contains_enable_paste_permission = await contains_permission.contains_permission(toJS(inputs_data.obj.other_settings.enable_paste.permissions));

        runInAction(() => {
            inputs_data.obj.upload.download_img_when_link_given.visible = !!contains_allow_downloading_images_by_link_permission;
            inputs_data.obj.upload.paste.adjacent_btn_is_visible = !!contains_enable_paste_permission;
        });

    } catch (er) {
        err(er, 270);
    }
};
