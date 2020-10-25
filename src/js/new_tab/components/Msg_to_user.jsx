/* eslint-disable jsx-a11y/media-has-caption */

import React from 'react';
import { observable, action, configure } from 'mobx';
import { observer } from 'mobx-react';

import x from 'x';
import { db } from 'js/init_db';

configure({ enforceActions: 'observed' });


export class Msg_to_user extends React.Component {
    constructor(props) {
        super(props);

        this.ob = observable({
            show_msg_to_user: false,
            msg_to_user_hidden_once: false,
        });

        this.set_visibility = action(async (visibility, update_db_vals) => {
            try {
                this.ob.show_msg_to_user = visibility;

                if (update_db_vals) {
                    await db.ed.update(1, { msg_to_user_hidden_once: true });
                    await db.ed.update(1, { show_msg_to_user: false });
                }

            } catch (er) {
                err(er, 221);
            }
        });
    }

    async componentDidMount() {
        const ed_all = await eda();

        this.ob.msg_to_user_hidden_once = ed_all.msg_to_user_hidden_once;

        this.set_visibility(ed_all.show_msg_to_user, false);
    }

    render() {
        return (
            env.what_browser === 'chrome' && this.ob.show_msg_to_user && !this.ob.msg_to_user_hidden_once
                ? (
                    <div
                        className="msg_to_user"
                        onClick={() => this.set_visibility(false, true)}
                        role="none"
                    >
                        {x.msg('msg_to_user_text')}
                    </div>

                )
                : <></>
        );
    }
}

observer(Msg_to_user);
