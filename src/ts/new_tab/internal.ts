import 'new_tab/msgs/scripts';

misplaced_dependency('new_tab');

export * from 'new_tab/init';

export * as c_new_tab from 'new_tab/components';
export * as c_home_btn from 'new_tab/home_btn/components';

export * as c_background from 'new_tab/background/components';

export * as d_background from 'new_tab/background/data';
export * as d_home_btn from 'new_tab/home_btn/data';

export * as i_background from 'new_tab/background/interfaces';

export * as s_background from 'new_tab/background/scripts';
export * as s_custom_code from 'new_tab/custom_code/scripts';
export * as s_home_btn from 'new_tab/home_btn/scripts';

export * as p_new_tab from 'new_tab/components/prop_types';
export * as p_background from 'new_tab/background/components/prop_types';
