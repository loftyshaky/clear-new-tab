import React from 'react';
import { observer } from 'mobx-react';

import { c_inputs } from '@loftyshaky/shared/inputs';
import { p_settings } from 'settings/internal';

export const Section: React.FunctionComponent<p_settings.Section> = observer((props) => {
    const { section_name, section, children } = props;

    return (
        <div className={x.cls(['section', section_name])}>
            <h1 className='section_name'> {ext.msg(`${section_name}_section_text`)}</h1>
            <div className='section_help'>
                {n(section) && section.include_help ? (
                    <c_inputs.HelpBtn section_or_input={section} />
                ) : undefined}
                {n(section) && section.include_help ? (
                    <c_inputs.Help section_or_input={section} />
                ) : undefined}
            </div>
            <div className='section_content'>{children}</div>
        </div>
    );
});
