import React from 'react';

export const Left_fieldset = props => {
    const { name, children } = props;
    return (
        <fieldset className="input_fieldset">
            <legend
                className={`${name}_legend`}
                data-text={`${name}_legend_text`}
            />
            <div className={`${name}_w`}>
                {children}
            </div>
        </fieldset>
    );
};
