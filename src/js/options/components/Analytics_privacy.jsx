import React from 'react';
import { observer } from 'mobx-react';

import * as analytics from 'js/analytics';
import * as analytics_privacy from 'options/analytics_privacy';

import { Tr } from 'js/components/Tr';
import { Btn } from 'options/components/Btn';

export const Analytics_privacy = observer(() => (
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
                    on_click={analytics_privacy.trigger_enable_analytics_checkbox_check_to_allow_analytics}
                />
                <Btn
                    name="disallow_analytics"
                    on_click={analytics_privacy.disallow_analytics}
                />
                <a
                    className="link analytics_privacy_privacy_policy_link"
                    href="https://put_link_here"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-text="privacy_policy_link_text"
                    onMouseUp={analytics.send_links_event.bind(null, 'analytics_privacy', 'privacy_policy_link', null)}
                >
                    content
                </a>
            </div>
        </Tr>
    </React.Fragment>
));
