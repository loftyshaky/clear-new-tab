//> what browser t

//> console.log t

//> selecting elements t

//> notify about error f

//> dom manipulation t

//> matches f

//> closest f

//> load_css f

//> delay f

//>1 unique_id f

//> filter_classes f

//> get extension data t

//> chrome o

//>1 localization t

//>1 message passing t

//>1 iterate_all_tabs f

//^

"use strict";

import db from 'js/init_db';
import { decorate, observable, runInAction, configure } from "mobx";
import * as r from 'ramda';

configure({ enforceActions: true });

const x = {};
window.ed = null; // extension_data
window.what_browser = null;

window.browser = (function () {
    return window.msBrowser ||
        window.browser ||
        window.chrome;
})();

const title = document.querySelector('title');
window.page = title ? title.dataset.page : 'background';

//> what browser t
(() => {
    const url = browser.extension.getURL('');
    const cur_browser = url.substring(0, url.indexOf(':'));

    if (cur_browser == 'chrome-extension') {
        if (url.indexOf('lgmmcdanmhkefaipfaokekdlanepjnji') !== - 1) {
            what_browser = 'opera';

        } else {
            what_browser = 'chrome';
        }

    } else if (cur_browser == 'moz-extension') {
        what_browser = 'firefox';
    }
})();
//< what browser t

//> console.log t
window.l = console.log.bind(console);
//< console.log t

//> selecting elements t
window.s = (selector) => { // $
    return document.querySelector(selector);
}

window.sa = (selector) => { // $ All
    return document.querySelectorAll(selector);
}

window.sb = (base_element, selector) => { // $ with base element
    return base_element ? base_element.querySelector(selector) : null;
}

window.sab = (base_element, selector) => { // $ All with base element
    return base_element ? base_element.querySelectorAll(selector) : null;
}
//< selecting elements t

//> notify about error f
x.error = (error_code) => { // last error code: 1
    const error_message = x.message('error_alert') + error_code;

    alert(error_message);
}
//< notify about error f

//> dom manipulation t
x.create = (el_type, class_name) => { // create element
    let el = document.createElement(el_type);
    el.className = class_name;

    return el;
};

x.append = (el, child) => { // append child
    if (el && el.nodeType == 1) { // if not document
        el.appendChild(child);
    }
};

x.remove = el => { // remove child
    if (el && el.nodeType == 1) { // if not document
        el.parentNode.removeChild(el);
    }
};


x.before = (el_to_insert_before, el_to_insert) => { // insert before
    if (el_to_insert_before && el_to_insert.nodeType == 1) { // if not document
        el_to_insert_before.parentNode.insertBefore(el_to_insert, el_to_insert_before);
    }
};

x.after = (el_to_insert_after, el_to_insert) => { // insert after
    if (el_to_insert_after && el_to_insert.nodeType == 1) { // if not document
        el_to_insert_after.parentNode.insertBefore(el_to_insert, el_to_insert_after.nextElementSibling);
    }
};
//< dom manipulation t

//> matches f
x.matches = (el, selector) => {
    if (el && el.nodeType == 1) { // if not document
        return el.matches(selector);

    } else {
        return false;
    }
};
//< matches f

//> closest f
x.closest = (el, selector) => {
    if (el && el.nodeType == 1) { // if not document
        return el.closest(selector);
    }
};
//< closest f

//> move an array item t
x.move_a_item = (a, from, to) => {
    a.splice(to, 0, a.splice(from, 1)[0]);
};
//< move an array item t

//> load_css f
x.load_css = (filename) => {
    let link;

    if (!sb(document.head, '.' + filename)) {
        link = document.createElement("link");
        link.className = filename;
        link.href = browser.extension.getURL(filename + '.css');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        x.append(document.head, link);
    }

    return link;
};
//< load_css f

//> delay f
x.delay = delay => {
    return new Promise(resolve => window.setTimeout(() => resolve(), delay));
};
//< delay f

//>1 unique_id f
x.unique_id = () => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const len = possible.length;
    let unique_id = Date.now();

    for (let i = 0; i < 8; i++) {
        unique_id += possible.charAt(Math.floor(Math.random() * len));
    }

    return unique_id;
};
//<1 unique_id f

//> filter_classes f
x.cls = classes => {
    const pipe_f = r.pipe(r.filter, r.values, r.join(' '));

    return pipe_f(item => item, classes);
}
//< filter_classes f

//> get extension data t
x.get_ed = async (callback) => {
    try {
        const new_ed = await db.ed.get(1);

        runInAction(() => {
            ed = new_ed;
        });

        if (callback) {
            callback();
        }

    } catch (er) {
        console.error(er);
    }
};
//< get extension data t

//> chrome o
//>1 localization t
x.message = (message) => {
    return browser.i18n.getMessage(message);
}

x.localize = (base_element) => {
    const localize_inner = (item_key, loc_key, what_browser) => {
        const arr = sab(base_element, '[data-' + loc_key + ']');

        arr.forEach(item => item[item_key] = x.message(item.dataset[loc_key]));
    }

    const localize_without_browser = r.curry(localize_inner)(r.__, r.__, '');

    localize_without_browser('innerHTML', 'text');
    localize_without_browser('placeholder', 'placeholder');
    localize_without_browser('href', 'href');
    localize_inner('innerHTML', 'bstext', '_' + what_browser); // browser specefic text
    localize_inner('href', 'bshref', '_' + what_browser); // browser specefic href
}
//<1 localization t

//>1 message passing t
x.send_message_to_background = (message) => { // to background.js ex: '{"message": "create_search_engine_form"}'
    browser.runtime.sendMessage(message, function () { });
}

x.send_message_to_background_c = (message) => { // c = callback
    return new Promise((resolve, reject) => {
        browser.runtime.sendMessage(message, response => {
            if (browser.runtime.lastError) {
                reject(browser.runtime.lastError);

            } else {
                resolve(response);
            }
        });
    });
}

x.send_message_to_tab = (id, message) => {
    browser.tabs.sendMessage(id, message, function () { });
}

x.send_message_to_tab_c = (id, message) => {
    return new Promise((resolve, reject) => {
        browser.tabs.sendMessage(id, message, response => {
            if (browser.runtime.lastError) {
                reject(browser.runtime.lastError);

            } else {
                resolve(response);
            }
        });
    });
}
//<1 message passing t

//>1 iterate_all_tabs f
x.iterate_all_tabs = (callback, callback_args) => {
    browser.windows.getAll({ populate: true, windowTypes: ['normal'] }, windows => {
        for (const window of windows) {
            for (const tab of window.tabs) {
                callback(tab.id, ...callback_args);
            }
        }
    });
};
//<1 iterate_all_tabs f
//< chrome o

decorate(window, {
    ed: observable
});

export default x;