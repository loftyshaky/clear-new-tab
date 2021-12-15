import 'settings/msgs/scripts';

misplaced_dependency('settings');

export * from 'settings/init';

export * as c_settings from 'settings/components';
export * as c_backgrounds from 'settings/backgrounds/components';

export * as d_background_settings from 'settings/background_settings/data';
export * as d_backgrounds from 'settings/backgrounds/data';
export * as d_sections from 'settings/sections/data';

export * as s_background_settings from 'settings/background_settings/scripts';
export * as s_backgrounds from 'settings/backgrounds/scripts';

export * as p_settings from 'settings/components/prop_types';

export * as p_backgrounds from 'settings/backgrounds/components/prop_types';

export * as i_backgrounds from 'settings/backgrounds/interfaces';
