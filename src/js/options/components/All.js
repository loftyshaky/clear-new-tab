//> All c

//^

'use strict';

import x from 'x'
import * as shared_o from 'options/shared_o';
import * as moving from 'js/moving';
import * as permissions from 'options/permissions';
import * as settings from 'options/settings';
import * as img_loading from 'js/img_loading';
import * as img_deletion from 'options/img_deletion';
import { Tr } from 'js/Tr';

import { Loading_screen } from 'options_components/Loading_screen';
import { Left_fieldset } from 'options_components/Left_fieldset';
import { Install_help } from 'options_components/Install_help';
import { Theme_img_link } from 'options_components/Theme_img_link';
import { Upload_box } from 'options_components/Upload_box';
import { Input } from 'options_components/Input';
import { Checkbox } from 'options_components/Checkbox';
import { Select } from 'options_components/Select';
import { Color } from 'options_components/Color';
import { Btn } from 'options_components/Btn';
import { Link } from 'options_components/Link';
import { Imgs_fieldset } from 'options_components/Imgs_fieldset';

import react from 'react';
import react_dom from 'react-dom';
import { observer } from "mobx-react";

//> All c
export class All extends react.Component {
    constructor(props) {
        super(props);

        this.dragged_item = react.createRef();

        this.evl = {
            stop_drag: moving.stop_drag.bind(null, 'options'),
            set_dragged_item_position: moving.set_dragged_item_position.bind(null, 'options')
        }
    }

    componentWillMount() {
        permissions.restore_optional_permissions_checkboxes_state();
        shared_o.decide_what_input_items_to_hide();
        shared_o.set_color_input_vizualization_color('color', ed.color);
    }

    componentDidMount() {
        moving.mut.dragged_item = react_dom.findDOMNode(this.dragged_item.current);

        img_loading.load_50_or_all_imgs(50, 'first_load');

        document.addEventListener('mousedown', settings.show_or_hide_color_pickier_when_clicking_on_color_input_vizualization);
        document.addEventListener('mouseup', this.evl.stop_drag);
        document.addEventListener('mousemove', this.evl.set_dragged_item_position);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', settings.show_or_hide_color_pickier_when_clicking_on_color_input_vizualization);
        document.removeEventListener('mousedown', this.evl.stop_drag);
        document.removeEventListener('mousedown', this.evl.set_dragged_item_position);
    }

    render() {
        // <Loading_screen show_loading_screen={img_loading.show_loading_screen} />
        return (
            <div className='all'>
                <Tr
                    attr={{
                        className: 'dragged_item'
                    }}
                    tag='div'
                    name='dragged_img'
                    state={moving.ob.show_dragged_item}
                    ref={this.dragged_item}
                ></Tr>
                <Loading_screen />
                <div className='main'>
                    <Left_fieldset name='upload'>
                        <Install_help />
                        {what_browser == 'chrome' ? <Theme_img_link /> : null}
                        <Upload_box />
                        <Input
                            name='paste'
                            storage='background_url'
                            add_help
                            input_btn_visibility={shared_o.ob.hidable_input_items.paste_btn}
                        />
                        <Checkbox
                            name='download_img_when_link_given'
                            is_other_settings_fieldset={false}
                            onchange_f={settings.change_settings}
                        />
                        <Color
                            name='create_solid_color_img'
                            include_global_checkbox={false}
                            accept_color={img_loading.create_solid_color_img}
                        />
                    </Left_fieldset>
                    <Left_fieldset name='img_settings'>
                        <Select
                            name='mode'
                        />
                        <Select
                            name='change_interval'
                        />
                        <Checkbox
                            name='keep_old_themes_imgs'
                            is_other_settings_fieldset={false}
                            onchange_f={settings.change_settings}
                        />
                        <Checkbox
                            name='slideshow'
                            is_other_settings_fieldset={false}
                            onchange_f={settings.change_settings}
                        />
                        <Checkbox
                            name='shuffle'
                            is_other_settings_fieldset={false}
                            onchange_f={settings.change_settings}
                        />
                        <Input
                            name='current_img'
                            storage='current_img'
                            val={settings.ob.current_img_input_val}
                            input_visibility={shared_o.ob.hidable_input_items.current_img}
                        />
                        <hr className='separator'></hr>
                        <Select
                            name='settings_type'
                            add_help
                        />
                        <Select
                            name='size'
                            add_help
                            show_global_options={settings.ob.show_global_options}
                        />
                        <Select
                            name='position'
                            show_global_options={settings.ob.show_global_options}
                        />
                        <Select
                            name='repeat'
                            show_global_options={settings.ob.show_global_options}
                        />
                        <Color
                            name='color'
                            include_global_checkbox={true}
                            accept_color={settings.change_settings_color}
                        />
                    </Left_fieldset>
                    <Left_fieldset name='other_settings'>
                        <Btn
                            name='restore_global_defaults'
                            onclick_f={settings.restore_default_global_settings}
                        />
                        <Btn
                            name='delete_all_imgs'
                            onclick_f={img_deletion.delete_all_images}
                        />
                        <div>
                            <Checkbox
                                name='show_bookmarks_bar'
                                is_other_settings_fieldset={true}
                                onchange_f={permissions.ask_for_permission_or_remove_it.bind(null, 'show_bookmarks_bar', permissions.permissions_dict.show_bookmarks_bar)}
                            />
                            <Checkbox
                                name='enable_paste'
                                is_other_settings_fieldset={true}
                                onchange_f={permissions.ask_for_permission_or_remove_it.bind(null, 'enable_paste', permissions.permissions_dict.enable_paste)}
                            />
                            <Checkbox
                                name='allow_downloading_images_by_link'
                                is_other_settings_fieldset={true}
                                onchange_f={permissions.ask_for_permission_or_remove_it.bind(null, 'allow_downloading_images_by_link', permissions.permissions_dict.allow_downloading_images_by_link)}
                            />
                        </div>
                    </Left_fieldset>
                    <Left_fieldset name='links'>
                        <Link
                            name='clear_new_tab_for_link'
                            href='#'
                            add_data_bshref_attr={true}
                            browser={'chrome'}
                        />
                        <Link
                            name='clear_new_tab_for_link'
                            href='#'
                            add_data_bshref_attr={true}
                            browser={'firefox'}
                        />
                        <Link
                            name='clear_new_tab_for_link'
                            href='#'
                            add_data_bshref_attr={true}
                            browser={'opera'}
                        />
                        <Link
                            name='deviant_art_group_link'
                            href='https://bit.ly/deviant-art-group'
                            add_data_bshref_attr={false}
                        />
                        <Link
                            name='rate_link'
                            href='#'
                            add_data_bshref_attr={true}
                        />
                        <Link
                            name='donate_link'
                            href='https://bit.ly/donate-loftyshaky'
                            add_data_bshref_attr={false}
                        />
                    </Left_fieldset>
                </div>
                <Imgs_fieldset />
            </div>
        )
    }
}
//< All c

All = observer(All);
