import React, { useEffect } from 'react';
import { observer } from 'mobx-react';

import { c_inputs, o_inputs, d_inputs, i_inputs } from '@loftyshaky/shared/inputs';
import { c_progress } from 'shared/internal';
import {
    c_settings,
    c_backgrounds,
    c_custom_code,
    c_install_help,
    c_protecting_screen,
    c_scheduler,
    d_sections,
    p_settings,
} from 'settings/internal';

export const Body: React.FunctionComponent<p_settings.Body> = observer((props) => {
    const { on_render } = props;

    useEffect(() => {
        on_render();
    }, [on_render]);

    useEffect(
        () =>
            err(() => {
                const run = async () =>
                    err(() => {
                        d_inputs.NestedInput.set_all_parents_disbled_vals({
                            sections: d_sections.Sections.sections as i_inputs.Sections,
                            set_to_all_sections: true,
                        });
                    }, 'cnt_1182');

                run();
            }, 'cnt_1183'),
        [],
    );

    return (
        <>
            <div className='main'>
                <div className='main_2'>
                    <div className='sections custom settings'>
                        {Object.values(d_sections.Sections.sections).map(
                            (section: o_inputs.Section, i: number): JSX.Element => (
                                <c_settings.Section
                                    key={i}
                                    section_name={section.name}
                                    section={section}
                                >
                                    {section.name === 'background_upload' ? (
                                        <c_install_help.Body />
                                    ) : undefined}
                                    <c_inputs.SectionContent
                                        section={section}
                                        inputs={section.inputs}
                                    />
                                </c_settings.Section>
                            ),
                        )}
                    </div>
                    <c_backgrounds.Body />
                    <c_scheduler.Body />
                    <c_custom_code.Body />
                    <c_backgrounds.DraaggedBackground />
                </div>
            </div>
            <c_progress.Progress />
            <c_protecting_screen.Body />
        </>
    );
});
