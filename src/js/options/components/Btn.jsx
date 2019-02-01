'use_strict';

import React from 'react';

export const Btn = props => {
    const { name, onclick_f } = props;

    return (
        <button
            type="button"
            name={name}
            className="btn"
            data-text={`${name}_btn_text`}
            onClick={onclick_f}
        />
    );
};
