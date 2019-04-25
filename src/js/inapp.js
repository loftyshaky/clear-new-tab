import { observable, action, runInAction, configure } from 'mobx';

import x from 'x';
import { db } from 'js/init_db';
import * as analytics from 'js/analytics';

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

export const buy_premium = () => {
    google.payments.inapp.buy({
        parameters: { env: 'prod' },
        sku: 'premium',
        success: () => refresh_purchase_state(true),
        failure: response => failure_callback(response, 292),
    });
};

const failure_callback = (response, code, callback) => {
    err(er_obj(`In-app error: ${response.response.errorType}`), code, null, true);

    if (code === 292 && response.response.errorType !== 'PURCHASE_CANCELED') {
        window.alert(x.msg('purchase_error_alert'));
    }

    if (callback) {
        callback();
    }
};

export const refresh_purchase_state = just_purchased => {
    get_products(
        () => get_purchases(
            purchases => {
                check_license(purchases, just_purchased);
            },
        ),

        () => {
            set_premium_purchasing_state('error');
        },
    );
};

const check_license = async (purchases, just_purchased) => {
    try {
        const licensed = purchases.response.details.some(product => {
            try {
                return product.sku === 'premium' && product.state === 'ACTIVE';

            } catch (er) {
                err(er, 295);
            }

            return undefined;
        });

        if (licensed || just_purchased) {
            await activate_clear_new_tab();

            if (page === 'inapp') {
                analytics.send_inapp_event('purchased');

                x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'refresh_purchase_state' }]);
            }
        }

        await update_premium_ob();

    } catch (er) {
        err(er, 294);
    }
};

const activate_clear_new_tab = async () => {
    try {
        await db.ed.update(1, { premium: true });

    } catch (er) {
        err(er, 308);
    }
};

export const update_premium_ob = async () => {
    try {
        const premium = await ed('premium');

        if (premium) {
            set_premium_purchasing_state('licensed');

        } else {
            set_premium_purchasing_state('not_licensed');
        }

        runInAction(() => {
            try {
                ob.premium = premium;

            } catch (er) {
                err(er, 317);
            }
        });

    } catch (er) {
        err(er, 316);
    }
};

const set_premium_purchasing_state = action(state => {
    try {
        ob.premium_purchasing_state = state;

    } catch (er) {
        err(er, 306);
    }
});

export const check_if_clear_new_tab_is_activated = () => {
    try {
        return !ob.premium && what_browser !== 'firefox';

    } catch (er) {
        err(er, 318);
    }

    return undefined;
};

export const show_inapp_notice = name => {
    try {
        analytics.send_inapp_event('tried_to_activate_locked', name);
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

export const get_premium_price = () => {
    get_products(
        action(products => {
            try {
                const premium = products.response.details.inAppProducts.find(product => {
                    try {
                        return product.sku === 'premium' && product.state === 'ACTIVE';

                    } catch (er) {
                        err(er, 322);
                    }

                    return undefined;
                });

                if (premium) {
                    ob.premium_price = `${premium.prices[0].valueMicros / 1000000} ${premium.prices[0].currencyCode}`;

                    set_premium_purchasing_state('not_licensed');

                } else {
                    set_premium_purchasing_state('error');
                }

            } catch (er) {
                err(er, 323);
            }
        }),

        () => {
            set_premium_purchasing_state('error');
        },
    );
};

export const con = {
    features: ['theme_beta', 'random_solid_color', 'slideshow', 'slide', 'paste_btn'],
    video_ids: ['YlL8458rimc', 'MhfGZLZvA0Y', 'G2Crq715TyU', 'ZTEmthOSnjQ', 'k1D5KUC0eM0'],
};

export const ob = observable({
    premium: false,
    premium_price: null,
    premium_purchasing_state: 'fetching_products',
    products_to_display: [],
    show_inapp_notice: false,
});

update_premium_ob();
