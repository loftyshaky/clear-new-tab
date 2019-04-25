import React from 'react';

import x from 'x';
import * as analytics from 'js/analytics';

export class Premium_desc extends React.Component {
    componentDidMount() {
        try {
            x.bind(s('.inapp_clear_new_tab_for_firefox_link'), 'mouseup', analytics.send_links_event.bind(null, 'inapp', 'clear_new_tab_for_link', 'firefox'));

        } catch (er) {
            err(er, 324);
        }

    }

    render() {
        return (
            <p
                className="premium_desc"
                dangerouslySetInnerHTML={{ __html: x.msg('premium_desc_text') }} // eslint-disable-line react/no-danger
            />
        );
    }
}
