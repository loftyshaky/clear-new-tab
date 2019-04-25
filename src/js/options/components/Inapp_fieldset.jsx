import React from 'react';
import { observer } from 'mobx-react';

import x from 'x';
import * as inapp from 'js/inapp';

import { Learn_more } from 'options/components/Learn_more';

export const Inapp_fieldset = observer(() => (
    <fieldset className="input_fieldset inapp_fieldset">
        <legend
            className="inapp_legend"
            data-text="inapp_legend_text"
        />
        <div className="inapp_w">
            <p>
                {x.msg(`premium_purchasing_state_${inapp.ob.premium_purchasing_state}_text`)}
                {inapp.ob.premium_purchasing_state === 'not_licensed'
                    ? (
                        <React.Fragment>
                            {' '}
                            <Learn_more
                                classname="link inapp_fieldset_learn_more_link"
                                family="inapp_fieldset"
                            />
                        </React.Fragment>
                    )
                    : null
                }
            </p>
        </div>
    </fieldset>
));
