# Clear New Tab

<a href="https://github.com/loftyshaky/clear-new-tab/tags"><img src="https://img.shields.io/github/v/tag/loftyshaky/clear-new-tab?label=Version&color=blue" alt="Version"></a> <a href="LICENSE.md"><img src="https://img.shields.io/badge/License-MIT-orange.svg" alt="License: MIT"></a> <img src="https://img.shields.io/github/downloads/loftyshaky/clear-new-tab/total?label=Downloads%20&color=green" alt="GitHub all releases"> <img src="https://img.shields.io/github/downloads/loftyshaky/clear-new-tab/latest/total?sort=date&label=Downloads@Latest&color=green" alt="GitHub Release">

A browser extension that enables you to remove everything from the new tab page while keeping your theme background, or use any image, GIF, or video as a custom wallpaper.

## Links

[README.md на русском](https://github.com/loftyshaky/clear-new-tab/blob/master/README-RU.md)<br>
[Chrome Web Store](https://chromewebstore.google.com/detail/felphkbfjadmcejnibcmcncimlappdde)<br>
[Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/ifphophaconbhfmkpdlfldelkjpjmlbj)<br>
[Add-ons for Firefox](https://addons.mozilla.org/firefox/addon/clear-new-tab)

## Features specific to Opera and Yandex Browser versions

In Clear New Tab for Opera and Yandex Browser, clicking the extension icon opens a new tab page instead of the extension's settings page. This is because both browsers removed the browser API that allows replacing the default new tab page.

### Opera

In Opera, I still managed to replace the default new tab page, but the behavior differs from Chrome in two ways:

1. **Default new tab page flashes briefly** – The Opera new tab page appears momentarily before Clear New Tab loads.
2. **Address bar shows the extension's URL** – The address bar displays the full URL of Clear New Tab's new tab page, and the cursor sits at the end of it. As a result, clicking the address bar won't select all text — you need to manually highlight it with your mouse.

**Workarounds for Opera:**

- Open Clear New Tab via the **extension icon** – This avoids the flashing and leaves the address bar unfocused, so clicking it selects the entire URL, letting you search immediately.
- Press **F8** to select all text in the address bar.
- Set a **keyboard shortcut** to open Clear New Tab's new tab page at `chrome://extensions/shortcuts`.

### Yandex Browser

In Yandex Browser, the new tab page functionality was **completely removed** by the developers. The only way to open Clear New Tab's new tab page is via the **extension icon**.

Once opened, it functions the same as in Opera, with one difference:
- Use **F6** to select all text in the address bar (instead of F8).

## Home button feature in Firefox version

The home button feature is **not available** in the Firefox version of Clear New Tab due to a platform limitation — Firefox does not allow extensions to programmatically open the browser's default new tab page.

## Build steps

1. `git clone https://github.com/loftyshaky/clear-new-tab`
2. `cd` into the cloned repository
3. `npm install`
4. `npm run prod_test` (Chrome) / `npm run prod_test_edge` (Edge) / `npm run prod_test_opera` (Opera) / `npm run prod_test_brave` (Brave) / `npm run prod_test_yandex` (Yandex Browser) / `npm run prod_test_firefox` (Firefox)
