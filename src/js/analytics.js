import * as r from 'ramda';

import x from 'x';

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
        const enable_analytics = await r.ifElse(
            () => page === 'background',
            async () => ed('enable_analytics'),

            async () => x.send_message_to_background_c({ message: 'get_enable_analytics_val' }),
        )();

        if (enable_analytics) {
            callback();
        }

    } catch (er) {
        err(er, 240);
    }
};

const send_request = async (mode, page, category, action) => {
    try {
        const message = `v=1&tid=UA-129081690-1&cid=${con.client_id}&aip=1&ds=extension&t=${mode === 'pageview' ? `pageview&dp=${page}` : `event&ec=${category}&ea=${action}`}`;

        await window.fetch('https://www.google-analytics.com/collect', {
            method: 'POST',
            body: message,
        });

    } catch (er) {
        err(er, 243);
    }
};

const get_client_id = () => {
    try {
        let match = document.cookie.match('(?:^|;)\\s*_ga=([^;]*)');
        const raw = (match) ? decodeURIComponent(match[1]) : null;

        if (raw) {
            match = raw.match(/(\d+\.\d+)$/);
        }

        const gacid = (match) ? match[1] : null;

        if (gacid) {
            return gacid;
        }


    } catch (er) {
        err(er, 244);
    }

    return undefined;
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

export const send_upload_box_upload_event = action => {
    try {
        send_event('upload_box_upload', action);

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

export const send_options_imgs_event = action => {
    try {
        send_event('options_imgs', action);

    } catch (er) {
        err(er, 264);
    }
};

export const send_new_tab_imgs_event = action => {
    try {
        send_event('new_tab_imgs', action);

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
    client_id: get_client_id(),
};