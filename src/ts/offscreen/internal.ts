import 'offscreen/msgs/scripts';

import '@loftyshaky/shared/ext';

misplaced_dependency(env.browser === 'firefox' ? 'background' : 'offscreen');

export * as s_backgrounds from 'offscreen/backgrounds/scripts';
