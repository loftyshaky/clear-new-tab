import React from 'react';
import { observer } from 'mobx-react';

import { Error_boundary } from 'js/components/Error_boundary';
import { Buy_premium_btn } from 'inapp/components/Buy_premium_btn';

export const All = observer(() => (
    <Error_boundary>
        <div className="all">
            <Buy_premium_btn />
            <Buy_premium_btn />
        </div>
    </Error_boundary>
));
