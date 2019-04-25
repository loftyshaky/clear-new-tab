import React from 'react';
import { observer } from 'mobx-react';

import x from 'x';
import * as analytics from 'js/analytics';
import * as inapp from 'js/inapp';

export class Purchase_zone extends React.Component {
    async componentDidMount() {
        await inapp.update_premium_ob();
        inapp.get_premium_price();
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
            <div className="purchase_zone">
                <p
                    className="purchase_zone_msg"
                >
                    {!inapp.ob.premium
                        ? x.msg(`premium_purchasing_state_${inapp.ob.premium_purchasing_state}_text`)
                        : x.msg('premium_purchasing_state_licensed_text')}
                </p>
                <button
                    className="buy_premium_btn"
                    type="button"
                    disabled={inapp.ob.premium || inapp.ob.premium_purchasing_state === 'error'}
                    onClick={this.try_to_buy}
                >
                    {`${x.msg('buy_premium_btn_text')}${inapp.ob.premium_price ? ` for ${inapp.ob.premium_price}` : ''}`}
                </button>
            </div>
        );
    }
}

observer(Purchase_zone);
