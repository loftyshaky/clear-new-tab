import { decorate, observable, configure } from 'mobx';
import * as r from 'ramda';

import { db } from 'js/init_db';

configure({ enforceActions: 'observed' });

const x = {};
const title = document.querySelector('title');
window.page = r.ifElse(
    () => window.location.protocol === 'https:' || window.location.protocol === 'http:',
    () => 'content_script',

    () => (title ? title.dataset.page : 'background'),
)();
window.browser = (() => window.msBrowser || window.browser || window.chrome)();

//> get extension data
window.ed = async key => {
    try {
        const store = await db.ed.get(1);

        return store[key];

    } catch (er) {
        console.error(er); // eslint-disable-line no-console
    }

    return undefined;
};

window.eda = async () => {
    try {
        return await db.ed.get(1);

    } catch (er) {
        console.error(er); // eslint-disable-line no-console
    }

    return undefined;
};
//< get extension data

//> what browser
(() => {
    const url = browser.extension.getURL('');
    const cur_browser = url.substring(0, url.indexOf(':'));

    if (cur_browser === 'chrome-extension') {
        if (url.indexOf('lgmmcdanmhkefaipfaokekdlanepjnji') !== -1) {
            window.what_browser = 'opera';

        } else {
            window.what_browser = 'chrome';
        }

    } else if (cur_browser === 'moz-extension') {
        window.what_browser = 'firefox';
    }
})();
//< what browser

window.l = console.log.bind(console); // eslint-disable-line no-console

//> selecting elements
window.s = selector => document.querySelector(selector); // $

window.sa = selector => document.querySelectorAll(selector); // $ All

window.sb = (base_element, selector) => ( // $ with base element
    base_element ? base_element.querySelector(selector) : null
);

window.sab = (base_element, selector) => ( // $ All with base element
    base_element ? base_element.querySelectorAll(selector) : null
);
//< selecting elements

//> dom manipulation
x.create = (el_type, class_name) => { // create element
    const el = document.createElement(el_type);
    el.className = class_name;

    return el;
};

x.append = (el, child) => { // append child
    if (el && el.nodeType === 1) { // if not document
        el.appendChild(child);
    }
};

x.remove = el => { // remove child
    if (el && el.nodeType === 1) { // if not document
        el.parentNode.removeChild(el);
    }
};


x.before = (el_to_insert_before, el_to_insert) => { // insert before
    if (el_to_insert_before && el_to_insert.nodeType === 1) { // if not document
        el_to_insert_before.parentNode.insertBefore(el_to_insert, el_to_insert_before);
    }
};

x.after = (el_to_insert_after, el_to_insert) => { // insert after
    if (el_to_insert_after && el_to_insert.nodeType === 1) { // if not document
        el_to_insert_after.parentNode.insertBefore(el_to_insert, el_to_insert_after.nextElementSibling);
    }
};
//< dom manipulation

x.matches = (el, selector) => {
    if (el && el.nodeType === 1) { // if not document
        return el.matches(selector);

    }

    return false;
};

x.closest = (el, selector) => {
    if (el && el.nodeType === 1) { // if not document
        return el.closest(selector);
    }

    return false;
};

x.add_cls = (el, cls_name) => {
    if (el && el.nodeType === 1) { // if not document
        el.classList.add(cls_name);
    }
};

x.remove_cls = (el, cls_name) => {
    if (el && el.nodeType === 1) { // if not document
        el.classList.remove(cls_name);
    }
};

//> move an array item
x.move_a_item = (a, from, to) => {
    a.splice(to, 0, a.splice(from, 1)[0]);
};
//< move an array item

//> add event listener to one or multiple elements t
x.bind = (els, event, f) => {
    if (els) {
        if (Object.prototype.isPrototypeOf.call(NodeList.prototype, els)) { // NodeList.prototype.isPrototypeOf(els) * returns true if els is node list (querySelectorAll) not (querySelector)
            for (const el of els) {
                el.addEventListener(event, f);
            }

        } else {
            els.addEventListener(event, f);
        }
    }
};
//< add event listener to one or multiple elements t

//> add event listener with arguments to one or multiple elements t
x.bind_a = (els, event, f, args) => {
    if (els) {
        if (Object.prototype.isPrototypeOf.call(NodeList.prototype, els)) { // NodeList.prototype.isPrototypeOf(els) * returns true if els is node list (querySelectorAll) not (querySelector)
            for (const el of els) {
                el.addEventListener(event, f.bind(...[el].concat(args)));
            }

        } else {
            els.addEventListener(event, f.bind(...[els].concat(args)));
        }
    }
};
//< add event listener with arguments to one or multiple elements t

x.load_css = filename => {
    let link;

    if (!sb(document.head, `.${filename}`)) {
        link = document.createElement('link');
        link.className = filename;
        link.href = browser.extension.getURL(`${filename}.css`);
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        x.append(document.head, link);
    }

    return link;
};

x.debounce = (f, wait, immediate) => {
    let timeout;

    return function () { // eslint-disable-line func-names
        const context = this;
        const args = arguments; // eslint-disable-line prefer-rest-params

        const later = () => {
            timeout = null;

            if (!immediate) {
                f.apply(context, args);
            }
        };

        const call_now = immediate && !timeout;

        clearTimeout(timeout);

        timeout = setTimeout(later, wait);

        if (call_now) {
            f.apply(context, args);
        }
    };
};

x.delay = delay => new Promise(resolve => window.setTimeout(() => resolve(), delay));

x.unique_id = () => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const len = possible.length;
    let unique_id = Date.now();

    for (let i = 0; i < 8; i++) {
        unique_id += possible.charAt(Math.floor(Math.random() * len));
    }

    return unique_id;
};

x.cls = classes => {
    const pipe_f = r.pipe(r.filter, r.values, r.join(' '));

    return pipe_f(item => item, classes);
};

//> chrome
//>1 localization
x.msg = message => browser.i18n.getMessage(message);

x.localize = base_element => {
    const localize_inner = (item_key, loc_key) => {
        const arr = sab(base_element, `[data-${loc_key}]`);

        arr.forEach(item => {
            const new_item = item;
            new_item[item_key] = x.msg(item.dataset[loc_key]);
        });
    };

    const localize_without_browser = r.curry(localize_inner)(r.__, r.__, '');

    localize_without_browser('innerHTML', 'text');
    localize_without_browser('placeholder', 'placeholder');
    localize_without_browser('href', 'href');
    localize_without_browser('title', 'tooltip');
    localize_inner('innerHTML', 'bstext', `_${what_browser}`); // browser specefic text
    localize_inner('href', 'bshref', `_${what_browser}`); // browser specefic href
};
//<1 localization

x.set = obj => new Promise((resolve, reject) => {
    browser.storage.sync.set(obj, () => {
        if (browser.runtime.lastError) {
            reject(browser.runtime.lastError);

        } else {
            resolve();
        }
    });
});

x.get = arr => new Promise((resolve, reject) => {
    browser.storage.sync.get(arr, result_obj => {
        if (browser.runtime.lastError) {
            reject(browser.runtime.lastError);

        } else {
            resolve(result_obj);
        }
    });
});

x.send_message_to_background = message => { // to background.js ex: '{"message": "create_search_engine_form"}'
    browser.runtime.sendMessage(message, () => {
        if (browser.runtime.lastError) {
            console.error(browser.runtime.lastError.message); // eslint-disable-line no-console
        }
    });
};

x.send_message_to_background_c = message => new Promise((resolve, reject) => { // c = callback
    browser.runtime.sendMessage(message, response => {
        if (browser.runtime.lastError) {
            reject(browser.runtime.lastError);

        } else {
            resolve(response);
        }
    });
});

x.send_message_to_tab = (id, message) => {
    browser.tabs.sendMessage(id, message, () => {
        if (browser.runtime.lastError) {
            console.error(browser.runtime.lastError.message); // eslint-disable-line no-console
        }
    });
};

x.send_message_to_tab_c = (id, message) => new Promise((resolve, reject) => {
    browser.tabs.sendMessage(id, message, response => {
        if (browser.runtime.lastError) {
            reject(browser.runtime.lastError);

        } else {
            resolve(response);
        }
    });
});

x.iterate_all_tabs = (callback, callback_args) => {
    browser.windows.getAll({ populate: true, windowTypes: ['normal'] }, windows => {
        windows.forEach(window => {
            window.tabs.forEach(tab => {
                callback(tab.id, ...callback_args);
            });
        });
    });
};

x.get_background = () => new Promise((resolve, reject) => {
    browser.runtime.getBackgroundPage(async background => {
        if (browser.runtime.lastError) {
            reject(browser.runtime.lastError);

        } else {
            resolve(background);
        }
    });
});

x.get_app_version = () => browser.runtime.getManifest().version;
//< chrome

decorate(window, {
    ed: observable,
});

window.xcon = {
    analytics_permissions: [{ origins: ['https://www.google-analytics.com/*'] }],
    privacy_policy_link: 'https://bit.ly/cws-privacy-policy',
};

export default x;
