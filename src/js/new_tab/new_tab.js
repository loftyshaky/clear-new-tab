//^

'use strict';

import x from 'x';
import 'new_tab/onmessage';

s('title').textContent = x.message('new_tab_title_text');

import { run_everything } from 'js/init_All';

x.get_ed(run_everything.bind(null, 'new_tab'));