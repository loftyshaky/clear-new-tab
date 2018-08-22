//> Link c

//>1 set create_link variable which decides wheter to create link component t

//>1 generate bstext and bshref attributes t

//^

'use strict';

import x from 'x';

import react from 'react';

//> Link c
export const Link = props => {
    //>1 set create_link variable which decides wheter to create link component t
    const is_clear_new_tab_for_link = props.name == 'clear_new_tab_for_link';
    const is_link_doesnt_belong_to_user_browser = what_browser !== props.browser;
    const create_clear_new_tab_for_link = is_clear_new_tab_for_link && is_link_doesnt_belong_to_user_browser;
    const create_link = !is_clear_new_tab_for_link || create_clear_new_tab_for_link;
    //<1 set create_link variable which decides wheter to create link component t

    //>1 generate bstext and bshref attributes t
    const browser = is_clear_new_tab_for_link ? props.browser : what_browser;
    const bstext = is_clear_new_tab_for_link ? props.name + '_text_' + browser : null;
    const bshref = props.add_data_bshref_attr ? props.name + '_href_' + browser : null;
    const opts = {
        ['data-bstext']: bstext,
        ['data-bshref']: bshref,
    }
    //<1 generate bstext and bshref attributes t

    return create_link ?
        <a
            className={x.cls(['bottom_link', props.name])}
            data-text={props.name + '_text'}
            href={props.href}
            {...opts}
        ></a> :
        null
}
//< Link c