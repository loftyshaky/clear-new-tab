import React from 'react';
import { observer } from 'mobx-react';

import x from 'x';
import * as backgrounds from 'new_tab/backgrounds';

import { Background_div } from 'new_tab/components/Background_div';
import { Link_to_default_new_tab } from 'new_tab/components/Link_to_default_new_tab';
import { Msg_to_user } from 'new_tab/components/Msg_to_user';

import { Error_boundary } from 'js/components/Error_boundary';

export class All extends React.Component {
    async componentDidMount() {
        try {
            backgrounds.display_background(false, false, false);

            x.bind(window, 'resize', backgrounds.resize_background);
            x.bind(document, 'visibilitychange', backgrounds.resize_background);

        } catch (er) {
            err(er, 56);
        }
    }

    render() {
        return (
            <Error_boundary>
                <div className="all">
                    {
                        backgrounds.ob.background_divs.no_tr_cls.map((not_used, i) => (
                            <Background_div
                                background_div_i={i}
                                key={backgrounds.ob.background_divs.keys[i]}
                            />
                        ))
                    }
                    <Link_to_default_new_tab />
                    <Msg_to_user />
                </div>
            </Error_boundary>
        );
    }
}

observer(All);
