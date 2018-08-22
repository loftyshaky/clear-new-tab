//> recieve messages t

//^

'use strict';

import x from 'x';
import * as installing_theme from 'content_script/installing_theme';

//> recieve messages t
browser.runtime.onMessage.addListener((message, sender, send_response) => {
    const msg = message.message;

    if (msg == 'notify_about_paid_theme_error') {
        alert(x.message('theme_installiation_error_alert'));

        send_response();
        
    } else if (msg == 'notify_about_wrong_mode') {
        alert(x.message('wrong_mode_alert'));

        send_response();
    }
});
//< recieve messages t