import x from 'x';
import * as contains_permission from 'js/contains_permission';

export const send_pageview = async page => {
    try {
        check_if_analytics_enabled(() => send_request('pageview', page, null, null));

    } catch (er) {
        err(er, 242);
    }
};

export const send_event = (category, action) => {
    try {
        check_if_analytics_enabled(() => send_request('action', null, category, action));

    } catch (er) {
        err(er, 241);
    }
};

const check_if_analytics_enabled = async callback => {
    try {
        const analytics_permission_given = page !== 'background' ? await x.send_message_to_background_c({ message: 'check_if_analytics_enabled' }) : await contains_permission.contains_permission(xcon.analytics_permissions);
        const allow_analytics = await ed('allow_analytics');

        if (analytics_permission_given && allow_analytics) {
            callback();
        }

    } catch (er) {
        err(er, 240);
    }
};

const send_request = async (mode, page, category, action) => {
    try {
        const tracking_id = 'UA-136382243-1';
        const client_id_try = await x.get(['client_id']);

        if (!client_id_try.client_id) {
            await x.set({ client_id: con.generated_client_id });
        }

        const client_id_obj = client_id_try && client_id_try.client_id ? client_id_try : { client_id: con.generated_client_id };
        const message = `v=1&tid=${tracking_id}&cid=${client_id_obj.client_id}&aip=1&ds=extension&t=${mode === 'pageview' ? `pageview&dp=${page}` : `event&ec=${category}&ea=${action}`}`;

        await window.fetch('https://www.google-analytics.com/collect', {
            method: 'POST',
            body: message,
        });

    } catch (er) {
        err(er, 243);
    }
};

export const send_app_version_event = () => {
    try {
        send_event('app_version', x.get_app_version());

    } catch (er) {
        err(er, 278);
    }
};

export const send_alerts_event = alert_name => {
    try {
        send_event('alerts', alert_name);

    } catch (er) {
        err(er, 253);
    }
};

export const send_confirms_accepted_event = confirm_name => {
    try {
        send_event('confirms', `accepted-${confirm_name}`);

    } catch (er) {
        err(er, 254);
    }
};

export const send_confirms_canceled_event = confirm_name => {
    try {
        send_event('confirms', `canceled-${confirm_name}`);

    } catch (er) {
        err(er, 255);
    }
};

export const send_prompts_accepted_event = prompt_name => {
    try {
        send_event('prompts', `accepted-${prompt_name}`);

    } catch (er) {
        err(er, 256);
    }
};

export const send_prompts_canceled_event = prompt_name => {
    try {
        send_event('prompts', `canceled-${prompt_name}`);

    } catch (er) {
        err(er, 257);
    }
};

export const send_btns_event = (family, name) => {
    try {
        send_event('btns', `clicked-${family}-${name}`);

    } catch (er) {
        err(er, 258);
    }
};

export const send_analytics_privacy_btns_event = name => {
    try {
        send_event('btns', `clicked-analytics_privacy-${name}`);

    } catch (er) {
        err(er, 259);
    }
};

export const send_links_event = (family, name, browser) => {
    try {
        send_event('links', `clicked-${family}-${name}${browser ? `-${browser}` : ''}`);

    } catch (er) {
        err(er, 260);
    }
};

export const send_text_inputs_event = (action, family, name) => {
    try {
        send_event('text_inputs', `${action}-${family}-${name}`);

    } catch (er) {
        err(er, 261);
    }
};

export const send_upload_box_event = action => {
    try {
        send_event('upload_box', action);

    } catch (er) {
        err(er, 262);
    }
};

export const send_help_event = (action, family, name) => {
    try {
        send_event('help', `${action}-${family}-${name}`);

    } catch (er) {
        err(er, 263);
    }
};

export const send_options_backgrounds_event = action => {
    try {
        send_event('options_backgrounds', action);

    } catch (er) {
        err(er, 264);
    }
};

export const send_new_tab_backgrounds_event = action => {
    try {
        send_event('new_tab_backgrounds', action);

    } catch (er) {
        err(er, 265);
    }
};

export const send_permissions_event = (action, name) => {
    try {
        send_event('permissions', `${action}-${name}`);

    } catch (er) {
        err(er, 266);
    }
};

const con = {
    generated_client_id: `${Math.floor(Math.random() * (2147483647 - 1000000000 + 1)) + 1000000000}.${Math.floor(new Date().getTime() / 1000)}`, // eqwuavelent of php rand(1000000000, 2147483647) . '.' . time();
};
