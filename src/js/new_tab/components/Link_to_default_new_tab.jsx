'use_strict';

import Svg from 'svg-inline-react';
import React from 'react';
import { observer } from 'mobx-react';

import x from 'x';
import * as analytics from 'js/analytics';
import * as link_to_default_new_tab from 'new_tab/link_to_default_new_tab';

import home from 'svg/home';

export class Link_to_default_new_tab extends React.Component {
    componentDidMount() {
        try {
            link_to_default_new_tab.set_show_link_to_default_new_tab_observable();

        } catch (er) {
            err(er, 219);
        }
    }

    render() {
        return (
            <a
                className={x.cls(['link_to_default_new_tab', link_to_default_new_tab.ob.show_link_to_default_new_tab ? '' : 'none'])}
                data-tooltip="link_to_default_new_tab_tooltip"
                tabIndex="0"
                href="https://www.google.com/_/chrome/newtab"
                onMouseUp={analytics.send_event.bind(null, 'links', 'clicked-link_to_default_new_tab')}
            >
                <Svg src={home} />
            </a>
        );
    }
}

observer(Link_to_default_new_tab);
