'use_strict';

window.open_theme_img = () => {
    try {
        browser.tabs.create({ url: 'chrome://theme/IDR_THEME_NTP_BACKGROUND' });

    } catch (er) {
        err(er, 33, null, true);
    }
};
