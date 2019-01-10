//> Link c

//>1 set create_link variable which decides wheter to create link component t

//>1 generate bstext and bshref attributes t

//^

import x from 'x';

import React from 'react';

//> Link c
export const Link = props => {
    const { name, browser, add_data_bshref_attr, href } = props;

    //>1 set create_link variable which decides wheter to create link component t
    const is_clear_new_tab_for_link = name === 'clear_new_tab_for_link';
    const is_link_doesnt_belong_to_user_browser = what_browser !== browser;
    const create_clear_new_tab_for_link = is_clear_new_tab_for_link && is_link_doesnt_belong_to_user_browser;
    const create_link = !is_clear_new_tab_for_link || create_clear_new_tab_for_link;
    //<1 set create_link variable which decides wheter to create link component t

    //>1 generate bstext and bshref attributes t
    const browser_final = is_clear_new_tab_for_link ? browser : what_browser;
    const bstext = is_clear_new_tab_for_link ? `${name}_text_${browser_final}` : null;
    const bshref = add_data_bshref_attr ? `${name}_href_${browser_final}` : null;
    const opts = {
        'data-bstext': bstext,
        'data-bshref': bshref,
    };
    //<1 generate bstext and bshref attributes t

    return create_link
        ? (
            <a
                className={x.cls(['bottom_link', name])}
                data-text={`${name}_text`}
                href={href}
                {...opts}
            />
        )
        : null;
};
//< Link c
