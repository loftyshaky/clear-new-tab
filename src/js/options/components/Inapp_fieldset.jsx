import React from 'react';
import { observer } from 'mobx-react';

import x from 'x';
import * as inapp from 'options/inapp';

export const Inapp_fieldset = observer(() => (
    <fieldset className="input_fieldset inapp_fieldset">
        <legend
            className="inapp_legend"
            data-text="inapp_legend_text"
        />
        <div className="inapp_w">
            {/* eslint-disable-next-line react/no-danger */}
            <p dangerouslySetInnerHTML={{ __html: x.msg(`products_purchasing_overview_${inapp.ob.products_purchasing_overview}_text`) }} />
        </div>
    </fieldset>
));
