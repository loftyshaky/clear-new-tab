import React from 'react';
import { observer } from 'mobx-react';

import * as analytics from 'js/analytics';
import * as inapp from 'js/inapp';

export class Buy_premium_btn extends React.Component {
    componentDidMount() {
        inapp.update_premium_ob();
    }

    componentDidUpdate() {
        inapp.update_premium_ob();
    }

    try_to_buy = () => {
        try {
            analytics.send_inapp_event('tried_to_buy');

            inapp.buy_premium();

        } catch (er) {
            err(er, 305);
        }
    };

    render() {
        return (
            <button
                type="button"
                data-text="buy_premium_btn_text"
                disabled={inapp.ob.premium}
                onClick={this.try_to_buy}
            />
        );
    }
}

observer(Buy_premium_btn);
