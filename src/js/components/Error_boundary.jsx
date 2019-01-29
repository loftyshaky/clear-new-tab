import React from 'react';
import { observer } from 'mobx-react';

import x from 'x';
import * as error from 'js/error';

const ui_state = page === 'options' ? require('options/ui_state') : null;

export class Error_boundary extends React.Component {
    static getDerivedStateFromError() {
        error.set_component_has_er(true);
    }

    componentDidUpdate() {
        x.localize(document);
    }

    componentDidCatch(er) {
        err(er, 121, 'cant_render_ui');

        if (page === 'options') {
            ui_state.enable_ui();
        }
    }

    render() {
        if (error.ob.component_has_er) {
            return (
                <button
                    className="btn reload_ui_btn"
                    type="button"
                    onClick={error.set_component_has_er.bind(null, false)}
                >
                    {x.msg('reload_ui_btn_text')}
                </button>
            );
        }

        const { children } = this.props;

        return children;
    }
}

observer(Error_boundary);
