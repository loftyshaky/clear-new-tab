import React from 'react';

import * as analytics from 'js/analytics';

export const Theme_img_link = () => {
    //> open theme image when clicking on 'this'(install_help_theme_img_link) in install_help or theme_img_link
    const open_theme_img = e => {
        try {
            e.preventDefault();

            analytics.send_btns_event('upload', 'theme_img_link');

            browser.runtime.getBackgroundPage(background => background.open_theme_img());

        } catch (er) {
            err(er, 93);
        }
    };
    //< open theme image when clicking on 'this'(install_help_theme_img_link) in install_help or theme_img_link

    return (
        <button
            type="button"
            className="link theme_img_link"
            data-text="theme_img_link_text"
            href="#"
            onClick={open_theme_img}
        />
    );
};
