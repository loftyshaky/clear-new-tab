'use_strict';

import { observable, action, runInAction, configure, toJS } from 'mobx';

import x from 'x';
import { db } from 'js/init_db';
import * as analytics from 'js/analytics';
import * as contains_permission from 'js/contains_permission';
import { inputs_data } from 'options/inputs_data';
import * as settings from 'options/settings';
import * as permissions from 'options/permissions';

configure({ enforceActions: 'observed' });

export const trigger_enable_analytics_checkbox_check_to_allow_analytics = async () => {
    try {
        if (!con.analytics_permission_allowed) {
            s('#enable_analytics').click();

        } else {
            allow_analytics();
        }

    } catch (er) {
        err(er, 251);
    }
};

export const allow_analytics = action(async () => {
    try {
        const answered_to_analytics_privacy_question = await ed('answered_to_analytics_privacy_question');

        analytics.send_analytics_privacy_btns_event('allow_analytics');
        analytics.send_permissions_event('requested', 'enable_analytics');

        if (!answered_to_analytics_privacy_question) {
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

        settings.change_input_val('other_settings', 'enable_analytics', false);

        permissions.remove_permission(toJS(inputs_data.obj.other_settings.enable_analytics.permissions));

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

const get_analytics_permission_allowed_var = async () => {
    await x.delay(0);

    con.analytics_permission_allowed = page !== 'background' ? await x.send_message_to_background_c({ message: 'check_if_analytics_enabled' }) : contains_permission.contains_permission(analytics_permissions);
};

const con = {
    analytics_permission_allowed: false,
};

export const ob = observable({
    analytics_privacy_is_visible: false,
});

set_analytics_privacy_is_visible_var();
get_analytics_permission_allowed_var();
