import x from 'x';
import * as get_theme_beta_id from 'content_script/get_theme_beta_id';

if (env.what_browser === 'chrome') {
    x.bind(s('.btn-apply'), 'click', () => {
        try {
            x.send_message_to_background({ message: 'record_theme_beta_theme_id', theme_beta_theme_id: get_theme_beta_id.get_theme_beta_id() });

        } catch (er) {
            err(er, 284);
        }
    });
}
