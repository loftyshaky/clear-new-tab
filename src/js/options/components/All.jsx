import React from 'react';
import ReactDOM from 'react-dom';
import { observer } from 'mobx-react';

import x from 'x';
import * as shared_o from 'options/shared_o';
import * as moving from 'js/moving';
import * as permissions from 'options/permissions';
import * as settings from 'options/settings';
import * as img_deletion from 'options/img_deletion';

import { Tr } from 'js/Tr';

import { Error_boundary } from 'js/components/Error_boundary';
import { Loading_screen } from 'options/components/Loading_screen';
import { Left_fieldset } from 'options/components/Left_fieldset';
import { Install_help } from 'options/components/Install_help';
import { Theme_img_link } from 'options/components/Theme_img_link';
import { Upload_box } from 'options/components/Upload_box';
import { Btn } from 'options/components/Btn';
import { Link } from 'options/components/Link';
import { Imgs_fieldset } from 'options/components/Imgs_fieldset';

export class All extends React.Component {
    constructor(props) {
        super(props);

        this.dragged_item = React.createRef();

        this.evl = {
            stop_drag: moving.stop_drag.bind(null, 'options'),
            set_dragged_item_position: moving.set_dragged_item_position.bind(null, 'options'),
        };
    }

    async componentWillMount() {
        permissions.restore_optional_permissions_checkboxes_state();
        shared_o.decide_what_inputs_to_hide();
        shared_o.set_color_input_vizualization_color('img_settings', 'color', await ed123('color'));
    }

    componentDidMount() {
        moving.mut.dragged_item = ReactDOM.findDOMNode(this.dragged_item.current);

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
        return (
            <Error_boundary>
                <div className={x.cls(['all', settings.ob.global_options_is_visible ? null : 'global_options_is_hidden'])}>
                    <Tr
                        attr={{
                            className: 'dragged_item',
                        }}
                        tag="div"
                        name="dragged_img"
                        state={moving.ob.show_dragged_item}
                        ref={this.dragged_item}
                    />
                    <Loading_screen />
                    <div className="main">
                        <Left_fieldset family="upload">
                            <Install_help />
                            {what_browser === 'chrome' ? <Theme_img_link /> : null}
                            <Upload_box />
                        </Left_fieldset>
                        <Left_fieldset family="img_settings" />
                        <Left_fieldset
                            family="other_settings"
                            wrap_inputs
                        >
                            <Btn
                                name="restore_global_defaults"
                                onclick_f={settings.restore_default_global_settings}
                            />
                            <Btn
                                name="delete_all_imgs"
                                onclick_f={img_deletion.delete_all_images}
                            />
                        </Left_fieldset>
                        <Left_fieldset family="links">
                            <Link
                                name="clear_new_tab_for_link"
                                href="http"
                                add_data_bshref_attr
                                browser="chrome"
                            />
                            <Link
                                name="clear_new_tab_for_link"
                                href="http"
                                add_data_bshref_attr
                                browser="firefox"
                            />
                            <Link
                                name="clear_new_tab_for_link"
                                href="http"
                                add_data_bshref_attr
                                browser="opera"
                            />
                            <Link
                                name="chrome_theme_creator_microsoft_store_link"
                                href="https://bit.ly/ctc-microsoft-store"
                                add_data_bshref_attr={false}
                            />
                            <Link
                                name="chrome_theme_creator_packages_link"
                                href="https://bit.ly/ctc-packages"
                                add_data_bshref_attr={false}
                            />
                            <Link
                                name="facebook_page_link"
                                href="https://bit.ly/simpleext"
                                add_data_bshref_attr={false}
                            />
                            <Link
                                name="rate_link"
                                href="http"
                                add_data_bshref_attr
                            />
                            <Link
                                name="donate_link"
                                href="https://bit.ly/donate-loftyshaky"
                                add_data_bshref_attr={false}
                            />
                        </Left_fieldset>
                    </div>
                    <Imgs_fieldset />
                </div>
            </Error_boundary>
        );
    }
}

observer(All);
