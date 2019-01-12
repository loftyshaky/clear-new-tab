//> open options page when clicking on browser action
browser.browserAction.onClicked.addListener(() => {
    browser.runtime.openOptionsPage();
});
//< open options page when clicking on browser action
