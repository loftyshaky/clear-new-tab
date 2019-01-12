import x from 'x';
import 'options/onmessage';
import { run_everything } from 'js/init_All';

s('title').textContent = x.msg('options_title_text');

x.get_ed(run_everything.bind(null, 'options'));
