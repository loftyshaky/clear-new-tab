//> Install_help c

//>1 hide install help when clicking on "here" t

//^

'use strict';

import x from 'x';
import db from 'js/init_db';

import react from 'react';
import react_dom from 'react-dom';
import { observable, action, configure } from "mobx";
import { observer } from "mobx-react";

import { Tr } from 'js/Tr';

configure({ enforceActions: true });

//> Install_help c
export class Install_help extends react.Component {
    constructor(props) {
        super(props);

        this.ob = observable({
            show_install_help: ed.show_install_help
        });
    }

    componentDidMount() {
        sb(react_dom.findDOMNode(this), '.hide_install_help_link').addEventListener('click', this.hide_install_help);
    }

    //>1 hide install help when clicking on "here" t
    hide_install_help = action(e => {
        e.preventDefault(e)

        db.ed.update(1, { show_install_help: false });

        this.ob.show_install_help = false;
    });
    //<1 hide install help when clicking on "here" t

    render() {
        return (
            <Tr
                attr={{}}
                tag='div'
                name='gen'
                state={this.ob.show_install_help}
            >
                <p className="install_help" dangerouslySetInnerHTML={{ __html: x.message('install_help_text_' + what_browser) }} />
            </Tr>
        );
    }
}
//< Install_help c

Install_help = observer(Install_help);