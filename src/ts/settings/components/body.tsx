import React, { useEffect } from 'react';
import { observer } from 'mobx-react';

import { c_inputs, o_inputs, d_inputs, i_inputs } from '@loftyshaky/shared/inputs';
import { c_settings, d_sections } from 'settings/internal';

export const Body: React.FunctionComponent = observer(() => {
    useEffect(
        () =>
            err(() => {
                const run = async () =>
                    err(() => {
                        d_inputs.NestedInput.i().set_all_parents_disbled_vals({
                            sections: d_sections.Main.i().sections as i_inputs.Sections,
                            set_to_all_sections: true,
                        });
                    }, 'cnt_1123');

                run();
            }, 'cnt_1124'),
        [],
    );

    return (
        <div className='main'>
            <div className='sections custom settings'>
                {Object.values(d_sections.Main.i().sections).map(
                    (section: o_inputs.Section, i: number): JSX.Element => (
                        <c_settings.Section key={i} section_name={section.name} section={section}>
                            <c_inputs.SectionContent inputs={section.inputs} />
                        </c_settings.Section>
                    ),
                )}
            </div>
            <div className='sections custom imgs'>
                <c_settings.Section section_name='imgs'>
                    {Array(100)
                        .fill(undefined)
                        .map((item, i) => (
                            <span key={i} className='img'>
                                Image
                            </span>
                        ))}
                </c_settings.Section>
            </div>
        </div>
    );
});
