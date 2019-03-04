import React from 'react';
import { observer } from 'mobx-react';

import x from 'x';
import * as analytics from 'js/analytics';
import * as tab_focus from 'js/tab_focus';
import * as analytics_privacy from 'options/analytics_privacy';

import { Tr } from 'js/components/Tr';
import { Btn } from 'options/components/Btn';

export class Analytics_privacy extends React.Component {
    constructor(props) {
        super(props);

        this.last_el_to_focus = React.createRef();
    }

    componentDidMount() {
        x.bind_a(this.last_el_to_focus.current, 'keydown', tab_focus.focus_first_el_in_analytics_privacy_dialog, [this.first_el_to_focus]);
        x.bind_a(this.first_el_to_focus, 'keydown', tab_focus.focus_last_el_in_analytics_privacy_dialog, [this.last_el_to_focus.current]);
    }

    render() {
        return (
            <React.Fragment>
                <Tr
                    attr={{
                        className: 'analytics_privacy_protecting_screen',
                    }}
                    tag="div"
                    name="gen"
                    state={analytics_privacy.ob.analytics_privacy_is_visible}
                />
                <Tr
                    attr={{
                        className: 'analytics_privacy',
                    }}
                    tag="div"
                    name="gen"
                    state={analytics_privacy.ob.analytics_privacy_is_visible}
                >
                    <div
                        className="analytics_privacy_message"
                        data-text="analytics_privacy_message_text"
                    />
                    <div className="analytics_privacy_btns_and_link">
                        <Btn
                            name="allow_analytics"
                            on_click={analytics_privacy.trigger_allow_analytics_checkbox_check_to_allow_analytics}
                            btn_ref={node => { this.first_el_to_focus = node; }}
                            not_in_left_fieldset
                        />
                        <Btn
                            name="disallow_analytics"
                            on_click={analytics_privacy.disallow_analytics}
                            not_in_left_fieldset
                        />
                        <a
                            className="link privacy_policy_link"
                            href={xcon.privacy_policy_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-text="privacy_policy_link_text"
                            onMouseUp={analytics.send_links_event.bind(null, 'analytics_privacy', 'privacy_policy_link', null)}
                            ref={this.last_el_to_focus}
                        >
                            content
                        </a>
                    </div>
                </Tr>
            </React.Fragment>
        );
    }
}

observer(Analytics_privacy);
