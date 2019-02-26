import React from 'react';
import { observable, action, configure } from 'mobx';
import { observer } from 'mobx-react';

import * as analytics from 'js/analytics';

import { Tr } from 'js/components/Tr';

configure({ enforceActions: 'observed' });

export class Help extends React.Component {
    //> show or hide help_message when clicking on help_link
    show_or_hide_help_message = action(e => {
        try {
            e.preventDefault(e);

            if (this.ob.show_help_message) {
                analytics.send_help_event('hidden', this.family, this.name);

            } else {
                analytics.send_help_event('showed', this.family, this.name);
            }

            this.ob.show_help_message = !this.ob.show_help_message;

        } catch (er) {
            err(er, 75);
        }
    });
    //< show or hide help_message when clicking on help_link

    constructor(props) {
        super(props);

        ({
            add_help: this.add_help,
            family: this.family,
            name: this.name,
        } = this.props);

        this.ob = observable({
            show_help_message: false,
        });
    }

    render() {
        return this.add_help
            ? (
                <React.Fragment>
                    <button
                        type="button"
                        className="link help_link"
                        data-help-message={`${this.name}_help_message`}
                        data-text="help_link_text"
                        href="#"
                        onClick={this.show_or_hide_help_message}
                    />
                    <Tr
                        attr={{
                            className: 'help_message',
                            'data-text': `${this.name}_help_message_text`,
                        }}
                        tag="div"
                        name="gen"
                        state={this.ob.show_help_message}
                    />
                </React.Fragment>
            )
            : null;
    }
}

observer(Help);
