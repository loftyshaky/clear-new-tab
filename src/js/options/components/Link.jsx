import React from 'react';

import x from 'x';
import * as analytics from 'js/analytics';
import * as tab_focus from 'js/tab_focus';

export const Link = props => {
    const { name, browser, add_data_bshref_attr, href } = props;

    //> set create_link variable which decides wheter to create link component
    const is_clear_new_tab_for_link = name === 'clear_new_tab_for_link';
    const is_link_doesnt_belong_to_user_browser = env.what_browser !== browser;
    const create_clear_new_tab_for_link = is_clear_new_tab_for_link && is_link_doesnt_belong_to_user_browser;
    const create_link = !is_clear_new_tab_for_link || create_clear_new_tab_for_link;
    //< set create_link variable which decides wheter to create link component

    //> generate bstext and bshref attributes
    const browser_final = is_clear_new_tab_for_link ? browser : env.what_browser;
    const bstext = is_clear_new_tab_for_link ? `${name}_text_${browser_final}` : null;
    const bshref = add_data_bshref_attr ? `${name}_href_${browser_final}` : null;
    const opts = {
        'data-bstext': bstext,
        'data-bshref': bshref,
    };
    //< generate bstext and bshref attributes

    return create_link
        ? (
            <a
                className={x.cls(['link', 'bottom_link', name])}
                data-text={`${name}_text`}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                {...opts}
                onMouseUp={analytics.send_links_event.bind(null, 'links', name, is_clear_new_tab_for_link ? browser_final : null)}
                onFocus={tab_focus.focus_last_el_in_analytics_privacy_dialog_caller}
            />
        )
        : null;
};
