'use_strict';

import React from 'react';

export const Btn = props => {
    const { name, on_click } = props;

    return (
        <button
            type="button"
            name={name}
            className="btn"
            data-text={`${name}_btn_text`}
            onClick={on_click}
        />
    );
};
