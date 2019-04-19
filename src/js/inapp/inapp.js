import 'lib/buy';

import 'js/error_init';
import * as analytics from 'js/analytics';
import { run_everything } from 'js/init_All';

analytics.send_pageview('inapp');

run_everything('inapp');
