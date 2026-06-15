we.action.onClicked.addListener((): void =>
    err(() => {
        if (['opera', 'yandex'].includes(env.browser)) {
            void we.tabs.create({ url: we.runtime.getURL('new_tab.html') });
        } else {
            void we.runtime.openOptionsPage();
        }
    }, 'cnt_1003'),
);
