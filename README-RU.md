# Clear New Tab

<a href="https://github.com/loftyshaky/clear-new-tab/tags"><img src="https://img.shields.io/github/v/tag/loftyshaky/clear-new-tab?label=Version&color=blue" alt="Version"></a> <a href="LICENSE.md"><img src="https://img.shields.io/badge/License-MIT-orange.svg" alt="License: MIT"></a> <img src="https://img.shields.io/github/downloads/loftyshaky/clear-new-tab/total?label=Downloads%20&color=green" alt="GitHub all releases"> <img src="https://img.shields.io/github/downloads/loftyshaky/clear-new-tab/latest/total?sort=date&label=Downloads@Latest&color=green" alt="GitHub Release">

Браузерное расширение, позволяющее удалить всё со страницы новой вкладки, сохранив фон темы, или установить любое изображение, GIF или видео в качестве обоев.

## Ссылки

[README.md in English](https://github.com/loftyshaky/clear-new-tab/blob/master/README.md)<br>
[Интернет-магазин Chrome](https://chromewebstore.google.com/detail/felphkbfjadmcejnibcmcncimlappdde)<br>
[Надстройки Edge](https://microsoftedge.microsoft.com/addons/detail/ifphophaconbhfmkpdlfldelkjpjmlbj)<br>
[Дополнения для Firefox](https://addons.mozilla.org/firefox/addon/clear-new-tab)

## Особенности версий для Opera и Яндекс Браузера

В Clear New Tab для Opera и Яндекс Браузера нажатие на значок расширения открывает страницу новой вкладки вместо страницы настроек расширения. Это связано с тем, что в обоих браузерах удалён API, позволяющий заменять стандартную страницу новой вкладки.

### Opera

В Opera мне всё же удалось заменить стандартную страницу новой вкладки, но поведение отличается от Chrome в двух аспектах:

1. **Стандартная страница новой вкладки Opera мелькает** — страница новой вкладки Opera появляется на мгновение перед загрузкой Clear New Tab.
2. **В адресной строке отображается URL расширения** — в адресной строке показывается полный URL страницы новой вкладки Clear New Tab, а курсор находится в конце этого адреса. В результате нажатие в адресную строку не выделяет весь текст — нужно выделять его вручную мышью.

**Обходные решения для Opera:**

- Открывайте Clear New Tab через **значок расширения** — это позволяет избежать мелькания, а адресная строка остаётся без фокуса, поэтому нажатие на неё выделяет весь URL, позволяя сразу начать поиск.
- Нажмите **F8**, чтобы выделить весь текст в адресной строке.
- Назначьте **горячую клавишу** для открытия страницы новой вкладки Clear New Tab в `chrome://extensions/shortcuts`.

### Яндекс Браузер

В Яндекс Браузере функциональность страницы новой вкладки была **полностью удалена** разработчиками. Единственный способ открыть страницу новой вкладки Clear New Tab — через **значок расширения**.

После открытия она работает так же, как в Opera, с одним отличием:
- Используйте **F6** для выделения всего текста в адресной строке (вместо F8).

## Инструкция по сборке

1. `git clone https://github.com/loftyshaky/clear-new-tab`
2. `cd` в клонированный репозиторий
3. `npm install`
4. `npm run prod_test` (Chrome) / `npm run prod_test_edge` (Edge) / `npm run prod_test_opera` (Opera) / `npm run prod_test_brave` (Brave) / `npm run prod_test_yandex` (Яндекс Браузер) / `npm run prod_test_firefox` (Firefox)
