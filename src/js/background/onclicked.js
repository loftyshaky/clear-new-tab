//> open options page when clicking on browser action t

//^

'use strict';

//> open options page when clicking on browser action t
browser.browserAction.onClicked.addListener(() => {
    browser.runtime.openOptionsPage()
});
//< open options page when clicking on browser action t