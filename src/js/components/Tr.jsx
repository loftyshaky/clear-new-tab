'use_strict';

import React from 'react';
import { toJS, decorate, observable, action, configure } from 'mobx';
import { observer } from 'mobx-react';

configure({ enforceActions: 'observed' });

export class Tr extends React.Component {
    constructor(props) {
        super(props);

        ({
            name: this.name,
            tr_end_callbacks: this.tr_end_callbacks,
        } = this.props);

        this.normal_duration = 200;

        this.create_transitions();

        this.display_style = {}; // observable
    }

    componentWillMount() {
        try {
            this.handle_transition(false);

        } catch (er) {
            err(er, 187);
        }
    }

    componentDidUpdate() {
        try {
            this.handle_transition(true);

        } catch (er) {
            err(er, 188);
        }
    }

    create_transitions = () => {
        try {
            this.transitions = {
                gen: this.create_tran('opacity_0', 'opacity_1'), // general
                img: this.create_tran('opacity_0', 'opacity_1'),
                dragged_img: this.create_tran('opacity_0', 'opacity_08'),
                upload_box: this.create_tran('upload_box_unhover', 'upload_box_hover'),
            };

        } catch (er) {
            err(er, 189);

        }
    }

    //> choose component mode (shown or hidden)
    transit = (name, state) => {
        try {
            return state ? this.transitions[name].active : this.transitions[name].unactive;

        } catch (er) {
            err(er, 190);
        }

        return undefined;
    };
    //< choose component mode (shown or hidden)

    //> hide component when it faded out or show component when it starting fading in
    handle_transition = (called_from_component_did_update, tr_end_callbacks, e) => {
        try {
            const { state } = this.props;
            const component_uses_fading_transition = this.name === 'gen';

            if (component_uses_fading_transition) {
                const component_is_visible = this.display_style.visibility;

                if (!called_from_component_did_update && !state) {
                    if (!state) {
                        this.display_style = {
                            position: 'fixed',
                            visibility: 'hidden',
                        };
                    }

                } else if (state) {
                    if (component_is_visible) {
                        this.display_style = {};
                    }
                }
            }

            if (tr_end_callbacks && !state) {
                for (const tr_end_callback of tr_end_callbacks) {
                    tr_end_callback(e);
                }
            }

        } catch (er) {
            err(er, 191);
        }
    }
    //< hide component when it faded out or show component when it starting fading in

    //> create other transitions
    create_tran = (unactive, active) => { // def = default
        try {
            const tran = {
                unactive,
                active,
            };

            return tran;

        } catch (er) {
            err(er, 192);
        }

        return undefined;
    };
    //< create other transitions

    render() {
        const { attr, state, children, tr_ref } = this.props;

        if (attr) {
            const class_name = `${attr.className} ${this.transit(this.name, state)}`;
            const display_style = toJS(this.display_style);

            return (
                <this.props.tag
                    {...attr}
                    className={class_name}
                    ref={tr_ref}
                    style={display_style}
                    onTransitionEnd={this.handle_transition.bind(null, false, this.tr_end_callbacks)}
                >
                    {children}
                </this.props.tag>
            );
        }

        return null;
    }
}

decorate(Tr, {
    display_style: observable,

    handle_transition: action,
});

observer(Tr);
