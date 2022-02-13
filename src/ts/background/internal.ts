import 'background/browser_action/scripts';
import 'background/msgs/scripts';

misplaced_dependency('background');

export * from 'background/init';

export * as s_service_worker from 'background/service_worker/scripts';
export * as s_tabs from 'background/tabs/scripts';
export * as s_theme from 'background/theme/scripts';
