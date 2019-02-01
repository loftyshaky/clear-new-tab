'use_strict';

import { observable, action, configure } from 'mobx';

import * as prevent_scrolling from 'js/prevent_scrolling';

configure({ enforceActions: 'observed' });

//> show / hide imgs_fieldset_fillers
export const show_or_hide_imgs_fieldset_fillers = action(() => {
    try {
        const scroll_top = mut.imgs_fieldset.scrollTop;
        const scroll_height = mut.imgs_fieldset.scrollHeight - mut.imgs_fieldset.clientHeight;
        const at_the_top_of_imgs_fieldset_scrolling_down = scroll_top !== 0 && prevent_scrolling.mut.delta_y > 0 && scroll_top <= 14;
        const at_the_top_of_imgs_fieldset_scrolling_up = scroll_top <= 15 && prevent_scrolling.mut.delta_y < 0;
        const at_the_bottom_of_imgs_fieldset_scrolling_down = scroll_top >= scroll_height - 15 && prevent_scrolling.mut.delta_y > 0;
        const not_at_the_top_of_imgs_fieldset_scrolling_up = scroll_top <= scroll_height - 15 && prevent_scrolling.mut.delta_y < 0;
        const not_at_the_bottom = scroll_top <= scroll_height - 15;

        if (at_the_top_of_imgs_fieldset_scrolling_down) {
            ob.imgs_fieldset_filler_top_none_cls = '';

        } else if (at_the_top_of_imgs_fieldset_scrolling_up) {
            ob.imgs_fieldset_filler_top_none_cls = 'none';

        } else if (at_the_bottom_of_imgs_fieldset_scrolling_down) {
            ob.imgs_fieldset_filler_bottom_none_cls = 'none';

        } else if (not_at_the_top_of_imgs_fieldset_scrolling_up) {
            ob.imgs_fieldset_filler_bottom_none_cls = '';

        } else if (not_at_the_bottom) {
            ob.imgs_fieldset_filler_bottom_none_cls = '';
        }

    } catch (er) {
        err(er, 143);
    }
});
//< show / hide imgs_fieldset_fillers

export const show_imgs_fieldset_filler_bottom = action(() => {
    try {
        ob.imgs_fieldset_filler_bottom_none_cls = '';

    } catch (er) {
        err(er, 144);
    }
});

export const mut = {
    imgs_fieldset: null,
};

export const ob = observable({
    imgs_fieldset_filler_top_none_cls: 'none',
    imgs_fieldset_filler_bottom_none_cls: '',
});
