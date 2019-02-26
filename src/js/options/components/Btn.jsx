'use_strict';

import React from 'react';

export const Btn = props => {
    const { name, on_click, btn_ref } = props;

    return (
        <button
            type="button"
            name={name}
            className={`btn ${name}_btn`}
            data-text={`${name}_btn_text`}
            onClick={on_click}
            ref={btn_ref}
        />
    );
};
