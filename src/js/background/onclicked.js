'use_strict';

import * as analytics from 'js/analytics';

//> open options page when clicking on browser action
browser.browserAction.onClicked.addListener(() => {
    try {
        analytics.send_event('browser_action', 'opened_options_page');

        browser.runtime.openOptionsPage();

    } catch (er) {
        err(er, 18, null, true);
    }
});
//< open options page when clicking on browser action
