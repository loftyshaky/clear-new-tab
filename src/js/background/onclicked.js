'use_strict';

//> open options page when clicking on browser action
browser.browserAction.onClicked.addListener(() => {
    try {
        browser.runtime.openOptionsPage();

    } catch (er) {
        err(er, 18, null, true);
    }
});
//< open options page when clicking on browser action
