import 'settings/msgs/scripts';

misplaced_dependency('settings');

export * from 'settings/init';

export * as c_settings from 'settings/components';
export * as c_backgrounds from 'settings/backgrounds/components';
export * as c_dnd from 'settings/dnd/components';
export * as c_protecting_screen from 'settings/protecting_screen/components';
export * as c_scheduler from 'settings/scheduler/components';

export * as d_background_settings from 'settings/background_settings/data';
export * as d_backgrounds from 'settings/backgrounds/data';
export * as d_browser_theme from 'settings/browser_theme/data';
export * as d_dnd from 'settings/dnd/data';
export * as d_optional_permission_settings from 'settings/optional_permission_settings/data';
export * as d_protecting_screen from 'settings/protecting_screen/data';
export * as d_scheduler from 'settings/scheduler/data';
export * as d_sections from 'settings/sections/data';

export * as s_background_settings from 'settings/background_settings/scripts';
export * as s_backgrounds from 'settings/backgrounds/scripts';
export * as s_browser_theme from 'settings/browser_theme/scripts';
export * as s_i from 'settings/i/scripts';
export * as s_theme from 'settings/theme/scripts';
export * as s_virtualized_list from 'settings/virtualized_list/scripts';

export * as p_settings from 'settings/components/prop_types';

export * as p_backgrounds from 'settings/backgrounds/components/prop_types';
export * as p_dnd from 'settings/dnd/components/prop_types';
export * as p_scheduler from 'settings/scheduler/components/prop_types';

export * as i_backgrounds from 'settings/backgrounds/interfaces';
export * as i_browser_theme from 'settings/browser_theme/interfaces';
export * as i_optional_permission_settings from 'settings/optional_permission_settings/interfaces';
export * as i_sections from 'settings/sections/interfaces';
export * as i_virtualized_list from 'settings/virtualized_list/interfaces';
