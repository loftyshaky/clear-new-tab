//> Left_fieldset c

//^

'use strict';

import react from 'react';

//> Left_fieldset c
export const Left_fieldset = props => {
    return (
        <fieldset className='input_fieldset'>
            <legend
                className={props.name + '_legend'}
                data-text={props.name + '_legend_text'}
            ></legend>
            <div className={props.name + '_w'}>
                {props.children}
            </div>
        </fieldset>
    );
}
//< Left_fieldset c