'use_strict';

import React from 'react';
import { observable, action, runInAction, configure } from 'mobx';
import { observer } from 'mobx-react';

import x from 'x';
import { db } from 'js/init_db';

import { Tr } from 'js/Tr';

configure({ enforceActions: 'observed' });

export class Install_help extends React.Component {
    //> hide install help when clicking on "here"
    hide_install_help = action(e => {
        try {
            e.preventDefault(e);

            db.ed.update(1, { show_install_help: false });

            this.ob.show_install_help = false;

        } catch (er) {
            err(er, 86);
        }
    });
    //< hide install help when clicking on "here"

    constructor(props) {
        super(props);

        this.ob = observable({
            show_install_help: null,
        });
    }

    async componentWillMount() {
        try {
            const show_install_help = await ed('show_install_help');

            runInAction(() => {
                try {
                    this.ob.show_install_help = show_install_help;

                } catch (er) {
                    err(er, 88);
                }
            });

        } catch (er) {
            err(er, 87);
        }
    }

    componentDidMount() {
        try {
            sb(this.install_help_w, '.hide_install_help_link').addEventListener('click', this.hide_install_help);

        } catch (er) {
            err(er, 89);
        }

    }

    render() {
        return (
            <Tr
                attr={{
                    className: 'install_help_w',
                }}
                tag="div"
                name="gen"
                state={this.ob.show_install_help}
                tr_ref={node => { this.install_help_w = node; }}
            >
                {/* eslint-disable-next-line react/no-danger */}
                <p className="install_help" dangerouslySetInnerHTML={{ __html: x.msg(`install_help_text_${what_browser}`) }} />
            </Tr>
        );
    }
}

observer(Install_help);
