import x from 'x';
import 'js/error_init';
import 'options/inputs_data';
import 'options/onmessage';

import * as settings from 'options/settings';
import { run_everything } from 'js/init_All';

s('title').textContent = x.msg('options_title_text');

settings.load_settings(run_everything.bind(null, 'options'));
