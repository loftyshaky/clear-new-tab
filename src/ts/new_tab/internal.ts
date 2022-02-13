import 'new_tab/msgs/scripts';

misplaced_dependency('new_tab');

export * from 'new_tab/init';

export * as c_new_tab from 'new_tab/components';

export * as c_background from 'new_tab/background/components';

export * as d_background from 'new_tab/background/data';

export * as s_background from 'new_tab/background/scripts';
export * as s_service_worker from 'new_tab/service_worker/scripts';

export * as p_background from 'new_tab/background/components/prop_types';
