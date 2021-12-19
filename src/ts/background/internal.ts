import 'background/browser_action/scripts';
import 'background/msgs/scripts';

misplaced_dependency('background');

export * from 'background/init';

export * as s_data from 'background/data/scripts';
export * as s_theme from 'background/theme/scripts';
