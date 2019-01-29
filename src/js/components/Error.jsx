import React from 'react';
import { observer } from 'mobx-react';
import Svg from 'svg-inline-react';

import x from 'x';
import * as error from 'js/error';

import cross_svg from 'svg/cross';

//--

export class Error extends React.Component {
    componentDidMount() {
        try {
            window.addEventListener('load', () => {
                require('js/init_All'); // eslint-disable-line global-require
            });

        } catch (er) {
            err(er, 97);
        }
    }

    render() {
        return (
            <div
                className={x.cls([
                    'err',
                    error.ob.er_is_visible ? '' : 'none',
                    error.ob.er_is_highlighted ? 'er_highlighted' : '',
                ])}
                role="none"
                onMouseDown={error.clear_all_timeouts}
            >
                <div className="er_msg">
                    {error.ob.er_msg}
                </div>
                <button
                    className="er_close_btn"
                    type="button"
                    onClick={error.change_er_state.bind(null, 'er_is_visible', false)}
                >
                    <Svg src={cross_svg} />
                </button>
            </div>
        );
    }
}

observer(Error);
