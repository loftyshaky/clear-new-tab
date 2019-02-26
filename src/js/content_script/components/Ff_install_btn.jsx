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
        try {
            const { theme_id } = this.props;

            runInAction(() => {
                try {
                    this.ob.ff_install_btn_text = ff_install_btn_installing_text;

                } catch (er) {
                    err(er, 198);
                }
            });

            await installing_theme.install_theme(theme_id);

            runInAction(() => {
                try {
                    this.ob.ff_install_btn_text = ff_install_btn_text;

                } catch (er) {
                    err(er, 199);
                }
            });

        } catch (er) {
            err(er, 197);
        }
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
