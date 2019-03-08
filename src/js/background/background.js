/* eslint-disable import/first */

import 'js/error';
import 'background/setting_defaults';

set_default_settings('background');

import * as analytics from 'js/analytics';
import 'background/onmessage';
import 'background/onclicked';
import 'background/open_theme_img';
import 'background/theme_img';
import * as imgs from 'background/imgs';

analytics.send_pageview('background');
analytics.send_app_version_event();

imgs.load_imgs();
