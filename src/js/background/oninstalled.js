//> on install / on update actions
browser.runtime.onInstalled.addListener(async obj => {
    try {
        if (obj.reason === 'install') {
            await set_default_settings('background');

            browser.runtime.openOptionsPage();

        } else if (obj.reason === 'update') {
            await set_default_settings('background');
        }

    } catch (er) {
        err(er, 19, null, true);
    }
});
//< on install / on update actions
