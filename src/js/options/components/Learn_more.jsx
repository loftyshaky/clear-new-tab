import React from 'react';

import x from 'x';
import * as analytics from 'js/analytics';

export const Learn_more = props => {
    const { family, classname } = props;

    return (
        <a
            className={classname}
            target="_blank"
            rel="noopener noreferrer"
            href={browser.runtime.getURL('inapp.html')}
            onMouseUp={analytics.send_links_event.bind(null, family, 'learn_more_link', null)}
        >
            {x.msg('learn_more_link_text')}
        </a>
    );
};
