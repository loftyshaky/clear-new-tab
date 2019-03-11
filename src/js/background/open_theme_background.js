window.open_theme_background = () => {
    try {
        browser.tabs.create({ url: 'chrome://theme/IDR_THEME_NTP_BACKGROUND' });

    } catch (er) {
        err(er, 33, null, true);
    }
};
