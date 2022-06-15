import 'background/browser_action/scripts';
import 'background/msgs/scripts';
import 'background/on_installed/scripts';

misplaced_dependency('background');

export * from 'background/init';

export * as s_announcement from 'background/announcement/scripts';
export * as s_backgrounds from 'background/backgrounds/scripts';
export * as s_browser_theme from 'background/browser_theme/scripts';
export * as s_db from 'background/db/scripts';
export * as s_home_btn from 'background/home_btn/scripts';
export * as s_management from 'background/management/scripts';
export * as s_scheduler from 'background/scheduler/scripts';
export * as s_service_worker from 'background/service_worker/scripts';
export * as s_tabs from 'background/tabs/scripts';