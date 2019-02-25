'use_strict';

import { observable, action, runInAction, configure } from 'mobx';

import { db } from 'js/init_db';
import * as analytics from 'js/analytics';

configure({ enforceActions: 'observed' });

export const trigger_enable_analytics_checkbox_check_to_allow_analytics = () => {
    try {
        s('#enable_analytics').click();

    } catch (er) {
        err(er, 251);
    }
};

export const allow_analytics = action(async () => {
    try {
        const answered_to_analytics_privacy_question = await ed('answered_to_analytics_privacy_question');

        await db.ed.update(1, { enable_analytics: true });

        if (!answered_to_analytics_privacy_question) {
            analytics.send_analytics_privacy_btns_event('allow_analytics');
            analytics.send_permissions_event('requested', 'enable_analytics');
            analytics.send_permissions_event('allowed', 'enable_analytics');
            analytics.send_pageview('options');
        }

        hide_analytics_privacy();

    } catch (er) {
        err(er, 252);
    }
});

export const disallow_analytics = action(async () => {
    try {
        hide_analytics_privacy();

        analytics.send_analytics_privacy_btns_event('disallow_analytics');

        await db.ed.update(1, { enable_analytics: false });

    } catch (er) {
        err(er, 248);
    }
});

const hide_analytics_privacy = action(async () => {
    try {
        ob.analytics_privacy_is_visible = false;

        await db.ed.update(1, { answered_to_analytics_privacy_question: true });

    } catch (er) {
        err(er, 250);
    }
});

const set_analytics_privacy_is_visible_var = async () => {
    try {
        const answered_to_analytics_privacy_question = await ed('answered_to_analytics_privacy_question');

        runInAction(() => {
            ob.analytics_privacy_is_visible = !answered_to_analytics_privacy_question;
        });

    } catch (er) {
        err(er, 249);
    }
};

export const ob = observable({
    analytics_privacy_is_visible: false,
});

set_analytics_privacy_is_visible_var();
