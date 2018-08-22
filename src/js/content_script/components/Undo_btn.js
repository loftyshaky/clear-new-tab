//> Undo_btn c

//>1 undo_theme f

//^

'use strict';

import x from 'x';
import * as installing_theme from 'content_script/installing_theme';
import { Tr } from 'js/Tr';

import react from 'react';
import { observer } from "mobx-react";

//> Undo_btn c
export let Undo_btn = props => {
    //>1 undo_theme f
    const undo_theme = () => {
        installing_theme.undo_theme(installing_theme.mut.previous_installed_theme_theme_id)
    };
    //<1 undo_theme f

    return (
        <Tr
            attr={{}}
            tag='div'
            name='gen'
            state={installing_theme.ob.show_undo_btn}
        >
            <button
                className='btn undo_btn'
                onClick={undo_theme}
            >
                {x.message('undo_btn_text')}
            </button>
        </Tr>
    );
};
//< Undo_btn c

Undo_btn = observer(Undo_btn);