import Svg from 'svg-inline-react';
import React from 'react';
import { observer } from 'mobx-react';

import * as inapp from 'options/inapp';

import { Tr } from 'js/components/Tr';

import cross_svg from 'svg/cross';

export const Inapp_notice = observer(() => (
    <Tr
        attr={{
            className: 'inapp_notice',
        }}
        tag="div"
        name="gen"
        state={inapp.ob.show_inapp_notice}
    >
        <button
            className="inapp_notice_close_btn"
            type="button"
            onClick={inapp.close_inapp_notice.bind(null, true)}
        >
            <Svg src={cross_svg} />
        </button>
        <div
            className="inapp_notice_text"
            data-text="inapp_notice_text_text"
        />
        <button
            type="button"
            className="inapp_notice_learn_more_btn"
            data-text="inapp_notice_learn_more_btn_text"
        />
    </Tr>
));
