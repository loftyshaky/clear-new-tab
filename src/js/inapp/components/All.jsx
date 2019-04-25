import React from 'react';
import { observer } from 'mobx-react';

import x from 'x';
import * as inapp from 'js/inapp';

import { Error_boundary } from 'js/components/Error_boundary';
import { Premium_desc } from 'inapp/components/Premium_desc';
import { Purchase_zone } from 'inapp/components/Purchase_zone';

export const All = observer(() => (
    <Error_boundary>
        <div className="all">
            <h1 data-text="inapp_legend_text">-</h1>
            <Premium_desc />
            <Purchase_zone />
            <h2 data-text="features_h2_text">-</h2>
            {
                inapp.con.features.map((feature, i) => (
                    <div
                        className="feature_block"
                        key={x.unique_id()}
                    >
                        <h3 data-text={`inapp_${feature}_h3_text`}>-</h3>
                        <p
                            className="feature_desc"
                            data-text={`inapp_${feature}_feature_desc_text`}
                        />
                        <iframe title={feature} width="1024" height="576" frameBorder="0" src={`https://www.youtube.com/embed/${inapp.con.video_ids[i]}?rel=0&controls=0;&showinfo=0;&autoplay=1;&loop=1;&playlist=${inapp.con.video_ids[i]}`} />
                    </div>
                ))
            }
            <Purchase_zone />
        </div>
    </Error_boundary>
));
