import x from 'x';
import 'options/inputs_data';
import 'options/onmessage';

import * as settings from 'options/settings';
import { run_everything } from 'js/init_All';

s('title').textContent = x.msg('options_title_text');

x.get_ed(settings.load_settings.bind(null, run_everything.bind(null, 'options')));
