import React from 'react';
import { observer } from 'mobx-react';

import { c_app_version } from '@loftyshaky/shared/shared';
import { c_inputs } from '@loftyshaky/shared/inputs';
import { Tr } from 'shared/internal';
import { d_backgrounds, d_sections, p_settings } from 'settings/internal';

export const Section: React.FunctionComponent<p_settings.Section> = observer((props) => {
    const { section_name, section, children } = props;

    return (
        <Tr
            tag='div'
            name='fade'
            cls={x.cls(['section', section_name])}
            // eslint-disable-next-line max-len
            state={
                section_name !== 'offers' ||
                (section_name === 'offers' && data.settings.offers_are_visible)
            }
        >
            <h1
                className='section_name'
                role='none'
                onClick={
                    section_name === 'admin' ? d_sections.Val.enable_developer_mode : undefined
                }
            >
                {ext.msg(`${section_name}_section_text`)}
            </h1>
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
                state={d_sections.SectionContent.backgrounds_section_content_is_visible_computed({
                    section_name,
                })}
                tr_end_unactive={[
                    d_backgrounds.BackgroundDeletion.delete_all_backgrounds_transition_end_callback,
                ]}
            >
                {children}
                {section_name === 'links' ? <c_app_version.Body /> : undefined}
            </Tr>
        </Tr>
    );
});
