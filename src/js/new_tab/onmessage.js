import x from 'x';
import * as backgrounds from 'new_tab/backgrounds';
import * as link_to_default_new_tab from 'new_tab/link_to_default_new_tab';

//> recieve messages
browser.runtime.onMessage.addListener(async (message, sender, send_response) => {
    try {
        const msg = message.message;

        if (msg === 'confirm_that_opened_tab_is_new_tab_page_and_that_it_is_not_in_preview_mode') {
            if (window.location.search.indexOf('preview') === -1) {
                send_response(true);

            } else {
                send_response(false);
            }

        } else if (msg === 'change_background') {
            ed('slideshow')
                .then(slideshow => {
                    if (slideshow && window.location.search.indexOf('preview') === -1) {
                        backgrounds.display_background(false, true, true);
                    }

                }).catch(er => {
                    err(er, 279);
                });

        } else if (msg === 'reload_background') {
            link_to_default_new_tab.set_show_link_to_default_new_tab_observable();
            backgrounds.reload_background();
            x.send_message_to_background({ message: 'start_timer' });

        } else if (msg !== 'confirm_that_opened_tab_is_new_tab_page_and_that_it_is_not_in_preview_mode') {
            await x.delay(30000); // fixes bug when response is not received from background when sending same message to background while new tab page is open (firefox only)
        }

    } catch (er) {
        err(er, 67);
    }

    return true;
});
//< recieve messages
