import x from 'x';
import 'js/error_init';
import * as analytics from 'js/analytics';
import 'new_tab/onmessage';
import { run_everything } from 'js/init_All';

analytics.send_pageview('new_tab');

s('title').textContent = x.msg('new_tab_title_text');

run_everything('new_tab');
