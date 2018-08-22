//> Button c

//^

'use strict';

import react from 'react';

//> Button c
export const Btn = props => {
    return (
        <button
            name={props.name}
            className='btn'
            data-text={props.name + '_btn_text'}
            onClick={props.onclick_f}
            {...props.load_50_or_all_imgs}
        ></button>
    );
}
//< Button c