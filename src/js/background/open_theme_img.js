//> open_theme_img f

//^

//> open_theme_img f
window.open_theme_img = () => {
    browser.tabs.create({ url: 'chrome://theme/IDR_THEME_NTP_BACKGROUND' });
};
//< open_theme_img f
