//> on install / on update actions t

//^

//> on install / on update actions t
browser.runtime.onInstalled.addListener(async obj => {
    if (obj.reason === 'install') {
        await set_default_settings('background');

        browser.runtime.openOptionsPage();

    } else if (obj.reason === 'update') {
        await set_default_settings('background');
    }
});
//< on install / on update actions t
