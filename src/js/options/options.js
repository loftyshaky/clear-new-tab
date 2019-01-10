//^

import 'options/onmessage';

import { run_everything } from 'js/init_All';

import x from 'x';

s('title').textContent = x.message('options_title_text');

x.get_ed(run_everything.bind(null, 'options'));
