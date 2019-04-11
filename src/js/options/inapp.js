import * as r from 'ramda';
import { observable, action, runInAction, configure } from 'mobx';

import x from 'x';
import { db, products as ed_products } from 'js/init_db';
import * as analytics from 'js/analytics';
import { inputs_data } from 'options/inputs_data';
import { selects_options } from 'options/selects_options';
import * as inputs_hiding from 'options/inputs_hiding';
import * as settings from 'options/settings';

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

export const buy_product = product_id => {
    google.payments.inapp.buy({
        parameters: { env: 'prod' },
        sku: product_id,
        success: () => buy_product_callback(product_id),
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

export const buy_product_callback = product_id => {
    try {
        analytics.send_inapp_event('purchased', product_id);

        refresh_purchases_state();

    } catch (er) {
        err(er, 309);
    }
};

export const refresh_purchases_state = () => {
    get_products(
        products => get_purchases(
            purchases => {
                get_products_to_display(products, purchases);
            },
        ),

        () => {
            set_products_purchasing_overview_state('error');
        },
    );
};

const get_products_to_display = async (products, purchases) => {
    try {
        const purchasesd_in_app_products = purchases.response.details.filter(product => {
            try {
                return product.state === 'ACTIVE' || product.state === 'PENDING';

            } catch (er) {
                err(er, 295);
            }

            return undefined;
        });

        const everything_is_purchased = purchasesd_in_app_products.some(product => {
            try {
                return product.sku.match(con.all_regexp);

            } catch (er) {
                err(er, 297);
            }

            return undefined;
        });

        await activate_or_deactivate_product_license('all', everything_is_purchased);

        const all_in_app_products = products.response.details.inAppProducts.filter(product => {
            try {
                return product.state === 'ACTIVE';

            } catch (er) {
                err(er, 296);
            }

            return undefined;
        });

        const ordinary_products = all_in_app_products.filter(product => {
            try {
                return !product.sku.match(con.all_regexp);

            } catch (er) {
                err(er, 298);
            }

            return undefined;
        }); // products like theme_beta, slideshow (not all1, all2 etc.) etc.

        await ordinary_products.forEach(async (product, i) => {
            try {
                const product_is_purchased = purchasesd_in_app_products.some(item => item.sku === product.sku);

                ordinary_products[i].purchased = product_is_purchased;

                await activate_or_deactivate_product_license(product.sku, product_is_purchased);

            } catch (er) {
                err(er, 299);
            }

            return undefined;
        });

        if (!everything_is_purchased) {
            set_products_purchasing_overview_state('can_buy');

            const number_of_remained_ordinary_products = ordinary_products.filter(product => {
                try {
                    return !product.purchased;

                } catch (er) {
                    err(er, 300);
                }

                return undefined;
            }).length;

            if (number_of_remained_ordinary_products > 2) {
                mut.full_license_tier_to_offer = Math.ceil(number_of_remained_ordinary_products / 2);

            } else {
                mut.full_license_tier_to_offer = 1;
            }

            const current_allx_product = all_in_app_products.find(product => {
                try {
                    return product.sku === `all${mut.full_license_tier_to_offer}`;

                } catch (er) {
                    err(er, 301);
                }

                return undefined;
            });

            const products_to_display = r.prepend(current_allx_product, ordinary_products);

            const products_to_display_final = products_to_display.map(product => {
                try {
                    const product_with_key = product;
                    product_with_key.key = x.unique_id();

                    return product_with_key;

                } catch (er) {
                    err(er, 302);
                }

                return undefined;
            });

            set_products_to_display(products_to_display_final);

        } else {
            set_products_purchasing_overview_state('everything_is_purchased');
        }

        await update_products_ob();
        reset_paid_features_settings();

    } catch (er) {
        err(er, 294);
    }
};

const set_products_purchasing_overview_state = action(state => {
    try {
        ob.products_purchasing_overview = state;

    } catch (er) {
        err(er, 306);
    }
});

const set_products_to_display = action(products_to_display => {
    try {
        ob.products_to_display = products_to_display;

    } catch (er) {
        err(er, 307);
    }
});

const activate_or_deactivate_product_license = async (product_id, bool) => {
    try {
        await db.ed.toCollection().modify(ed => {
            ed.products[product_id] = bool; // eslint-disable-line no-param-reassign
        });

    } catch (er) {
        err(er, 308);
    }
};

export const update_products_ob = action(async () => {
    try {
        const new_products_obj = await ed('products');

        runInAction(() => {
            try {
                ob.products = new_products_obj;

            } catch (er) {
                err(er, 317);
            }
        });

    } catch (er) {
        err(er, 316);
    }
});

export const check_if_product_is_locked = product_id => {
    try {
        return product_id in ob.products && !ob.products[product_id] && !ob.products.all && what_browser !== 'firefox';

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

export const scroll_to_inapp_fieldset = () => {
    try {
        analytics.send_btns_event('inapp_notice', 'learn_more');

        const page_scroll_position = document.documentElement.scrollTop;

        s('.inapp_fieldset').scrollIntoView();

        const inapp_fieldset_scroll_position = document.documentElement.scrollTop;

        document.documentElement.scrollTop = page_scroll_position;

        window.scrollTo({
            top: inapp_fieldset_scroll_position - 6,
            behavior: 'smooth',
        });

        close_inapp_notice(false);

    } catch (er) {
        err(er, 313);
    }
};

export const reset_paid_features_settings = async () => {
    try {
        const all_purchased = ob.products.all;

        for (const family of Object.keys(inputs_data.obj)) {
            for (const name of Object.keys(inputs_data.obj[family])) {
                const input_feature_is_paid = 'default' in inputs_data.obj[family][name];

                if (input_feature_is_paid) {
                    const { type } = inputs_data.obj[family][name];
                    const current_input_setting = await ed(name); // eslint-disable-line no-await-in-loop
                    const default_input_setting = inputs_data.obj[family][name].default;
                    let paid_feature_selected_but_not_purchased = false;

                    if (type === 'select') {
                        for (const select_name of Object.keys(selects_options)) {
                            if (paid_feature_selected_but_not_purchased) {
                                break;
                            }

                            for (const option of selects_options[select_name]) {
                                if ('license_key' in option) {
                                    const input_feature_purchase_state = ob.products[option.license_key]; // true === purchased

                                    if (!input_feature_purchase_state) {
                                        paid_feature_selected_but_not_purchased = current_input_setting === option.license_key;

                                        if (paid_feature_selected_but_not_purchased) {
                                            break;
                                        }
                                    }
                                }
                            }
                        }

                    } else {
                        const input_feature_purchase_state = ob.products[inputs_data.obj[family][name].license_key]; // true === purchased

                        if (!input_feature_purchase_state) {
                            paid_feature_selected_but_not_purchased = current_input_setting !== default_input_setting;
                        }
                    }

                    if (!all_purchased && paid_feature_selected_but_not_purchased) {
                        await db.ed.update(1, { [name]: default_input_setting }); // eslint-disable-line no-await-in-loop

                        settings.change_input_val(family, name, default_input_setting);
                    }
                }
            }
        }

        inputs_hiding.decide_what_inputs_to_hide();

    } catch (er) {
        err(er, 320);
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
    products: ed_products,
    products_purchasing_overview: 'fetching_products',
    products_to_display: [],
    show_inapp_notice: false,
});
