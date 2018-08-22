//> Help c

//>1 show or hide help_message when clicking on help_link t

//^

'use strict';

import react from 'react';
import { observable, action, configure } from "mobx";
import { observer } from "mobx-react";

import { Tr } from 'js/Tr';

configure({ enforceActions: true });

//> Help c
export class Help extends react.Component {
    constructor(props) {
        super(props);

        this.ob = observable({
            show_help_message: false
        });
    }

    //>1 show or hide help_message when clicking on help_link t
    show_or_hide_help_message = action(e => {
        e.preventDefault(e)

        this.ob.show_help_message = !this.ob.show_help_message;
    });
    //<1 show or hide help_message when clicking on help_link t

    render() {
        return this.props.add_help ?
            (
                <react.Fragment>
                    <a
                        className='help_link'
                        data-help-message={this.props.name + '_help_message'}
                        data-text='help_link_text'
                        href='#'
                        onClick={this.show_or_hide_help_message}
                    ></a>
                    <Tr
                        attr={{
                            className: 'help_message',
                            ['data-text']: this.props.name + '_help_message_text'
                        }}
                        tag='div'
                        name='gen'
                        state={this.ob.show_help_message}
                    ></Tr>
                </react.Fragment>
            ) :
            null
    }
}
//< Help c

Help = observer(Help);