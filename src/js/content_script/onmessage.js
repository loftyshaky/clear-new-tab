import x from 'x';

//> recieve messages
browser.runtime.onMessage.addListener((message, sender, send_response) => {
    const msg = message.message;

    if (msg === 'notify_about_paid_theme_error') {
        alert(x.msg('theme_installiation_error_alert'));

        send_response();

    } else if (msg === 'notify_about_wrong_mode') {
        alert(x.msg('wrong_mode_alert'));

        send_response();
    }
});
//< recieve messages
