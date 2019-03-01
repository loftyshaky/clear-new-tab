import React from 'react';
import { observer } from 'mobx-react';

import x from 'x';
import * as settings from 'options/settings';
import * as moving from 'options/moving';
import * as permissions from 'options/permissions';
import * as inputs_hiding from 'options/inputs_hiding';
import * as ui_state from 'options/ui_state';

import { Tr } from 'js/components/Tr';
import { Error_boundary } from 'js/components/Error_boundary';
import { Analytics_privacy } from 'options/components/Analytics_privacy';
import { Loading_screen } from 'options/components/Loading_screen';
import { Left_fieldset } from 'options/components/Left_fieldset';
import { Install_help } from 'options/components/Install_help';
import { Theme_img_link } from 'options/components/Theme_img_link';
import { Upload_box } from 'options/components/Upload_box';
import { Link } from 'options/components/Link';
import { Imgs_fieldset } from 'options/components/Imgs_fieldset';

export class All extends React.Component {
    constructor(props) {
        super(props);

        this.evl = {
            stop_drag: moving.stop_drag.bind(null, 'options'),
            set_dragged_item_position: moving.set_dragged_item_position.bind(null, 'options'),
        };
    }

    async componentWillMount() {
        try {
            permissions.restore_optional_permissions_checkboxes_state();
            inputs_hiding.decide_what_inputs_to_hide();
            settings.set_color_input_vizualization_color('img_settings', 'color', await ed('color'));

        } catch (er) {
            err(er, 71);
        }
    }

    async componentDidMount() {
        try {
            moving.mut.dragged_item = this.dragged_item;

            x.bind(document, 'mousedown', settings.show_or_hide_color_pickier_when_clicking_on_color_input_vizualization);
            x.bind(document, 'mouseup', this.evl.stop_drag);
            x.bind(document, 'mousemove', this.evl.set_dragged_item_position);
            x.bind(document.body, 'keydown', settings.close_color_pickier_by_keyboard);

            const uploading_theme_img = await x.send_message_to_background_c({ message: 'check_if_uploading_theme_img' });

            if (uploading_theme_img) {
                ui_state.enter_upload_mode();
            }

        } catch (er) {
            err(er, 72);
        }
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
                        tr_ref={node => { this.dragged_item = node; }}
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
                        />
                        <Left_fieldset family="links">
                            <Link
                                name="privacy_policy_link"
                                href={x.msg('privacy_policy_link_href')}
                                add_data_bshref_attr={false}
                            />
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
                    <Analytics_privacy />
                </div>
            </Error_boundary>
        );
    }
}

observer(All);
