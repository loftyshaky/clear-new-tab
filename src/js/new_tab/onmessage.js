//> recieve messages t

//^

'use strict';

import x from 'x';
import * as  imgs from 'new_tab/imgs';

//> recieve messages t
browser.runtime.onMessage.addListener(async (message, sender, send_response) => {
    const msg = message.message;

    if (msg == 'confirm_that_opened_tab_is_new_tab_page_and_that_it_is_not_in_preview_mode') {
        if (location.search.indexOf('preview') == - 1) {
            send_response(true);

        } else {
            send_response(false);
        }

    } else if (msg == 'change_img') {
        await x.get_ed();

        if (ed.slideshow && location.search.indexOf('preview') == - 1) {
            imgs.display_img();
        }

    } else if (msg == 'reload_img') {
        await x.get_ed();
        imgs.reload_img();
        x.send_message_to_background({ message: 'update_time_setting_and_start_timer' });

    } else if (msg == 'display_img_on_ext_enable') {
        imgs.display_img();

    } else if (msg !== 'confirm_that_opened_tab_is_new_tab_page_and_that_it_is_not_in_preview_mode') {
        await x.delay(30000); // fixes bug when response is not received from background when sending same message to background while new tab page is open (firefox only)
    }

    return true;
});
//< recieve messages t