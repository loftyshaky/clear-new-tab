//> Ff_install_btn c

//>1 install_theme f

//^

'use strict';

import x from 'x';
import * as installing_theme from 'content_script/installing_theme';

import react from 'react';
import { observable, runInAction, configure } from "mobx";
import { observer } from "mobx-react";

configure({ enforceActions: true });

const ff_install_btn_text = x.message('ff_install_btn_text');
const ff_install_btn_installing_text = x.message('ff_install_btn_installing_text');

//> Ff_install_btn c
export class Ff_install_btn extends react.Component {
    constructor(props) {
        super(props);

        this.ob = observable({
            ff_install_btn_text: ff_install_btn_text
        });
    }

    //>1 install_theme f
    install_theme = async () => {
        runInAction(() => {
            this.ob.ff_install_btn_text = ff_install_btn_installing_text;
        });

        await installing_theme.install_theme(this.props.theme_id);

        runInAction(() => {
            this.ob.ff_install_btn_text = ff_install_btn_text;
        });
    }
    //<1 install_theme f

    render() {
        return (
            <button className='btn ff_install_btn' onMouseUp={this.install_theme}>{this.ob.ff_install_btn_text}</button>
        );
    }
}
//< Ff_install_btn c

Ff_install_btn = observer(Ff_install_btn);