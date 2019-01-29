import x from 'x';

export const enable_ui = () => x.remove(s('.ui_disabled'));

export const disable_ui = () => x.load_css('ui_disabled');
