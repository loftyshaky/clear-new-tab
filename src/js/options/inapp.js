import { observable, action, configure } from 'mobx';

import * as analytics from 'js/analytics';
import * as inapp from 'js/inapp';

configure({ enforceActions: 'observed' });

export const get_products = (success_callback, on_error) => {
    google.payments.inapp.getSkuDetails({
        parameters: { env: 'prod' },
        success: success_callback,
        failure: response => failure_callback(response, 290, on_error),
    });
};

export const get_purchases = success_callback => {
    google.payments.inapp.getPurchases({
        parameters: { env: 'prod' },
        success: success_callback,
        failure: response => failure_callback(response, 291),
    });
};

const failure_callback = (response, code, callback) => {
    err(er_obj(`In-app error: ${response.response.errorType}`), code, null, true);

    if (callback) {
        callback();
    }
};

export const refresh_purchases_state = () => {
    get_products(
        () => get_purchases(
            purchases => {
                check_license(purchases);
            },
        ),

        () => {
            set_premium_purchasing_overview_state('error');
        },
    );
};

const check_license = async purchases => {
    try {
        const licensed = purchases.response.details.some(product => {
            try {
                return product.sku === 'premium' && (product.state === 'ACTIVE' || product.state === 'PENDING');

            } catch (er) {
                err(er, 295);
            }

            return undefined;
        });

        if (licensed) {
            set_premium_purchasing_overview_state('licensed');

            inapp.activate_clear_new_tab();

        } else {
            set_premium_purchasing_overview_state('not_licensed');
        }

        await inapp.update_premium_ob();

    } catch (er) {
        err(er, 294);
    }
};

const set_premium_purchasing_overview_state = action(state => {
    try {
        ob.products_purchasing_overview = state;

    } catch (er) {
        err(er, 306);
    }
});

export const check_if_clear_new_tab_is_activated = () => {
    try {
        return !inapp.ob.premium && what_browser !== 'firefox';

    } catch (er) {
        err(er, 318);
    }

    return undefined;
};

export const show_inapp_notice = product_id => {
    try {
        analytics.send_inapp_event('tried_to_activate_locked', product_id);
        show_or_hide_inapp_notice(true);

    } catch (er) {
        err(er, 311);
    }
};

export const close_inapp_notice = send_analytics_event => {
    try {
        if (send_analytics_event) {
            analytics.send_btns_event('inapp_notice', 'close');
        }

        show_or_hide_inapp_notice(false);

    } catch (er) {
        err(er, 312);
    }
};

const show_or_hide_inapp_notice = action(bool => {
    try {
        ob.show_inapp_notice = bool;

    } catch (er) {
        err(er, 314);
    }
});

export const con = {
    all_regexp: new RegExp(/all[0-9]+/),
};

export const mut = {
    full_license_tier_to_offer: null,
};

export const ob = observable({
    products_purchasing_overview: 'fetching_products',
    products_to_display: [],
    show_inapp_notice: false,
});
