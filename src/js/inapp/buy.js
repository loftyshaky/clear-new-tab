import x from 'x';
import * as analytics from 'js/analytics';
import * as inapp from 'js/inapp';

export const buy_premium = () => {
    google.payments.inapp.buy({
        parameters: { env: 'prod' },
        sku: 'premium',
        success: () => buy_premium_success_callback('premium'),
        failure: response => buy_premium_failure_callback(response, 292),
    });
};

const buy_premium_success_callback = async () => {
    try {
        analytics.send_inapp_event('purchased');

        await inapp.activate_clear_new_tab();

        inapp.update_premium_ob();

        x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'refresh_purchases_state' }]);

    } catch (er) {
        err(er, 309);
    }
};

const buy_premium_failure_callback = (response, code, callback) => {
    err(er_obj(`In-app error: ${response.response.errorType}`), code, null, true);

    if (response.response.errorType !== 'PURCHASE_CANCELED') {
        window.alert(x.msg('purchase_error_alert'));
    }

    if (callback) {
        callback();
    }
};

s('body').addEventListener('click', () => {
    buy_premium_success_callback();
});
