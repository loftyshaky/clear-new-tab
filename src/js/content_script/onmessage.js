import x from 'x';
import * as installing_theme from 'content_script/installing_theme';

//> recieve messages
browser.runtime.onMessage.addListener((message, sender, send_response) => {
    try {
        const msg = message.message;

        if (msg === 'hide_undo_btn') {
            installing_theme.show_or_hide_undo_btn(false);

        } else if (msg === 'notify_about_paid_theme_error') {
            window.alert(x.msg('theme_installiation_error_alert'));

            send_response();

        } else if (msg === 'notify_about_wrong_mode') {
            window.alert(x.msg('wrong_mode_alert'));

            send_response();
        }

    } catch (er) {
        err(er, 208);
    }
});
//< recieve messages
