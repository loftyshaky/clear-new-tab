'use_strict';

import { toJS, runInAction, configure } from 'mobx';

import { inputs_data } from 'options/inputs_data';
import * as permissions from 'options/permissions';

configure({ enforceActions: 'observed' });

export const decide_what_inputs_to_hide = async () => {
    try {
        const mode = await ed('mode');

        runInAction(() => {
            inputs_data.obj.img_settings.keep_old_themes_imgs.visible = mode === 'theme';
            inputs_data.obj.img_settings.slideshow.visible = !!(mode === 'multiple' || mode === 'random_solid_color');
            inputs_data.obj.img_settings.shuffle.visible = mode === 'multiple';
            inputs_data.obj.img_settings.change_interval.visible = !!(mode === 'multiple' || mode === 'random_solid_color');
            inputs_data.obj.img_settings.current_img.visible = !!(mode === 'one' || mode === 'multiple');
            inputs_data.obj.img_settings.set_last_uploaded.visible = !!(mode === 'one' || mode === 'multiple');
        });

        const contains_allow_downloading_images_by_link_permission = await permissions.contains_permission(toJS(inputs_data.obj.other_settings.allow_downloading_images_by_link.permissions));
        const contains_enable_paste_permission = await permissions.contains_permission(toJS(inputs_data.obj.other_settings.enable_paste.permissions));

        runInAction(() => {
            inputs_data.obj.upload.download_img_when_link_given.visible = !!contains_allow_downloading_images_by_link_permission;
            inputs_data.obj.upload.paste.adjacent_btn_is_visible = !!contains_enable_paste_permission;
        });

    } catch (er) {
        err(er, 68);
    }
};