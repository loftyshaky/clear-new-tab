import { observable, action, configure } from 'mobx';

import * as prevent_scrolling from 'js/prevent_scrolling';

configure({ enforceActions: 'observed' });

//> show / hide backgrounds_fieldset_fillers
export const show_or_hide_backgrounds_fieldset_fillers = action(() => {
    try {
        const scroll_top = mut.backgrounds_fieldset.scrollTop;
        const scroll_height = mut.backgrounds_fieldset.scrollHeight - mut.backgrounds_fieldset.clientHeight;
        const at_the_top_of_backgrounds_fieldset_scrolling_down = scroll_top !== 0 && prevent_scrolling.mut.delta_y > 0 && scroll_top <= 14;
        const at_the_top_of_backgrounds_fieldset_scrolling_up = scroll_top <= 15 && prevent_scrolling.mut.delta_y < 0;
        const at_the_bottom_of_backgrounds_fieldset_scrolling_down = scroll_top >= scroll_height - 15 && prevent_scrolling.mut.delta_y > 0;
        const not_at_the_top_of_backgrounds_fieldset_scrolling_up = scroll_top <= scroll_height - 15 && prevent_scrolling.mut.delta_y < 0;
        const not_at_the_bottom = scroll_top <= scroll_height - 15;
        const no_scrollbar = scroll_top === 0;

        if (at_the_top_of_backgrounds_fieldset_scrolling_down) {
            ob.backgrounds_fieldset_filler_top_none_cls = '';

        } else if (at_the_top_of_backgrounds_fieldset_scrolling_up || no_scrollbar) {
            ob.backgrounds_fieldset_filler_top_none_cls = 'none';

        } else if (at_the_bottom_of_backgrounds_fieldset_scrolling_down) {
            ob.backgrounds_fieldset_filler_top_none_cls = '';
            ob.backgrounds_fieldset_filler_bottom_none_cls = 'none';

        } else if (not_at_the_top_of_backgrounds_fieldset_scrolling_up) {
            ob.backgrounds_fieldset_filler_bottom_none_cls = '';

        } else if (not_at_the_bottom) {
            ob.backgrounds_fieldset_filler_bottom_none_cls = '';
        }

    } catch (er) {
        err(er, 143);
    }
});
//< show / hide backgrounds_fieldset_fillers

export const show_backgrounds_fieldset_filler_bottom = action(() => {
    try {
        ob.backgrounds_fieldset_filler_bottom_none_cls = '';

    } catch (er) {
        err(er, 144);
    }
});

export const mut = {
    backgrounds_fieldset: null,
};

export const ob = observable({
    backgrounds_fieldset_filler_top_none_cls: 'none',
    backgrounds_fieldset_filler_bottom_none_cls: '',
});
