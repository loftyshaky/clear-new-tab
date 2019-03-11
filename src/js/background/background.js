/* eslint-disable import/first */

import 'js/error';
import 'background/setting_defaults';

set_default_settings('background');

import * as analytics from 'js/analytics';
import 'background/onmessage';
import 'background/onclicked';
import 'background/open_theme_background';
import 'background/theme_background';
import * as backgrounds from 'background/backgrounds';

analytics.send_pageview('background');
analytics.send_app_version_event();

backgrounds.load_backgrounds();
