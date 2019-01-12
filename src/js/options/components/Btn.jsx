import React from 'react';

export const Btn = props => {
    const { name, onclick_f, load_50_or_all_imgs } = props;
    return (
        <button
            type="button"
            name={name}
            className="btn"
            data-text={`${name}_btn_text`}
            onClick={onclick_f}
            {...load_50_or_all_imgs}
        />
    );
};
