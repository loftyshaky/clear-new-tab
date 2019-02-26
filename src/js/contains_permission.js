//> check for x permissions
export const contains_permission = permissions => new Promise((resolve, reject) => { // ex: await contains_permission([{'permissions': ['clipboardRead'] }]);
    browser.permissions.contains(...permissions, result => {
        if (browser.runtime.lastError) {
            reject(browser.runtime.lastError);

        } else {
            resolve(result);
        }
    });
});
//< check for x permissions
