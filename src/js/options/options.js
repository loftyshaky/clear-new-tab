import x from 'x';
import 'js/error_init';
import * as analytics from 'js/analytics';
import 'options/inputs_data';
import 'options/onmessage';

import { run_everything } from 'js/init_All';
import * as settings from 'options/settings';

analytics.send_pageview('options');

s('title').textContent = x.msg('options_title_text');

settings.load_settings(run_everything.bind(null, 'options'));
