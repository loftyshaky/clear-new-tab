import React from 'react';
import { observable, runInAction, configure } from 'mobx';
import { observer } from 'mobx-react';

import x from 'x';
import * as installing_theme from 'content_script/installing_theme';

configure({ enforceActions: 'observed' });

const ff_install_btn_text = x.msg('ff_install_btn_text');
const ff_install_btn_installing_text = x.msg('ff_install_btn_installing_text');

export class Ff_install_btn extends React.Component {
    constructor(props) {
        super(props);

        this.ob = observable({
            ff_install_btn_text,
        });
    }

    install_theme = async () => {
        const { theme_id } = this.props;

        runInAction(() => {
            this.ob.ff_install_btn_text = ff_install_btn_installing_text;
        });

        await installing_theme.install_theme(theme_id);

        runInAction(() => {
            this.ob.ff_install_btn_text = ff_install_btn_text;
        });
    }

    render() {
        return (
            <button
                type="button"
                className="btn ff_install_btn"
                onMouseUp={this.install_theme}
            >
                {this.ob.ff_install_btn_text}
            </button>
        );
    }
}

observer(Ff_install_btn);
