//> Theme_img_link c

//>1 open theme image when clicking on 'this'(install_help_theme_img_link) in install_help or theme_img_link t

//^

'use strict';

import react from 'react';
import react_dom from 'react-dom';

//> Theme_img_link c
export const Theme_img_link = props => {
    //>1 open theme image when clicking on 'this'(install_help_theme_img_link) in install_help or theme_img_link t
    const open_theme_img = e => {
        e.preventDefault();

        browser.runtime.getBackgroundPage(background => background.open_theme_img());
    }
    //<1 open theme image when clicking on 'this'(install_help_theme_img_link) in install_help or theme_img_link t

    return (
        <a
            className='theme_img_link'
            data-text='theme_img_link_text'
            href='#'
            onClick={open_theme_img}
        ></a>
    );
};
//< Theme_img_link c