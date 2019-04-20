import x from 'x';
import * as populate_storage_with_images_and_display_them from 'js/populate_storage_with_images_and_display_them';
import * as total_number_of_backgrounds from 'js/total_number_of_backgrounds';
import * as settings from 'options/settings';
import * as background_loading from 'options/background_loading';
import * as ui_state from 'options/ui_state';
import * as inapp from 'js/inapp';

//> recieve messages
browser.runtime.onMessage.addListener(async message => {
    try {
        const msg = message.message;

        if (msg === 'load_last_page') { // remove old theme images and then load new
            populate_storage_with_images_and_display_them.mut.uploading_backgrounds = true;

            total_number_of_backgrounds.set_total_number_of_backgrounds()
                .then(() => {
                    const last_page = Math.ceil(total_number_of_backgrounds.ob.number_of_backgrounds / populate_storage_with_images_and_display_them.con.backgrounds_per_page);

                    background_loading.load_page('load_page', last_page);

                }).catch(er => {
                    err(er, 135);
                });

        } else if (msg === 'change_current_background_input_val') {
            ed('current_background')
                .then(current_background => {
                    settings.change_current_background_input_val(current_background + 1);

                }).catch(er => {
                    err(er, 280);
                });

        } else if (msg === 'enter_upload_mode') { // when uploading theme image
            ui_state.enter_upload_mode();

        } else if (msg === 'exit_upload_mode_and_deselect_background') { // when uploading theme image
            settings.switch_to_settings_type(null, null, true);
            ui_state.exit_upload_mode(message.status);

        } else if (msg === 'refresh_purchase_state') { // when buying premium
            inapp.refresh_purchase_state();

        } else if (msg !== 'confirm_that_opened_tab_is_new_tab_page_and_that_it_is_not_in_preview_mode') {
            await x.delay(30000); // fixes bug when response is not received from background when sending same message to background while options page is open (firefox only)
        }

        if (msg !== 'confirm_that_opened_tab_is_new_tab_page_and_that_it_is_not_in_preview_mode') {
            return true;
        }

    } catch (er) {
        err(er, 134);
    }

    return undefined;
});
//< recieve messages
