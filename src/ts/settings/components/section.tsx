import React from 'react';
import { observer } from 'mobx-react';

import { c_app_version } from '@loftyshaky/shared';
import { c_inputs } from '@loftyshaky/shared/inputs';
import { Tr } from 'shared/internal';
import { d_backgrounds, d_sections, p_settings } from 'settings/internal';

export const Section: React.FunctionComponent<p_settings.Section> = observer((props) => {
    const { section_name, section, children } = props;

    return (
        <div className={x.cls(['section', section_name])}>
            <h1 className='section_name'>{ext.msg(`${section_name}_section_text`)}</h1>
            <div className='section_help'>
                {n(section) && section.include_help ? (
                    <c_inputs.HelpBtn section_or_input={section} />
                ) : undefined}
                {n(section) && section.include_help ? (
                    <c_inputs.Help section_or_input={section} />
                ) : undefined}
            </div>
            <Tr
                tag='div'
                name='fade'
                cls='section_content'
                // eslint-disable-next-line max-len
                state={d_sections.SectionContent.i().backgrounds_section_content_is_visible_computed(
                    { section_name },
                )}
                tr_end_unactive={[
                    d_backgrounds.BackgroundDeletion.i()
                        .delete_all_backgrounds_transition_end_callback,
                ]}
            >
                {children}
                {section_name === 'links' ? <c_app_version.Body /> : undefined}
            </Tr>
        </div>
    );
});
