import { db } from 'js/init_db';

browser.runtime.onInstalled.addListener(async details => {
    if (details.reason === 'update' && !ed.msg_to_user_hidden_once) {
        await db.ed.update(1, { show_msg_to_user: true });
    }
});
