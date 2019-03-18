import { observable, action, configure } from 'mobx';

configure({ enforceActions: 'observed' });

//> show / hide backgrounds_fieldset_fillers
export const show_or_hide_backgrounds_fieldset_fillers = action(() => {
    try {
        const scrollbar_is_visible = mut.backgrounds_fieldset.scrollHeight > mut.backgrounds_fieldset.clientHeight;

        if (scrollbar_is_visible) {
            const scroll_top = mut.backgrounds_fieldset.scrollTop;
            const scroll_height = mut.backgrounds_fieldset.scrollHeight - mut.backgrounds_fieldset.clientHeight;
            const at_the_top_of_backgrounds_fieldset = scroll_top === 0;
            const at_the_bottom_of_backgrounds_fieldset = scroll_top >= scroll_height - 15;


            if (at_the_top_of_backgrounds_fieldset) {
                ob.backgrounds_fieldset_filler_top_none_cls = 'none';

            } else {
                ob.backgrounds_fieldset_filler_top_none_cls = '';
            }

            if (at_the_bottom_of_backgrounds_fieldset) {
                ob.backgrounds_fieldset_filler_bottom_none_cls = 'none';

            } else {
                ob.backgrounds_fieldset_filler_bottom_none_cls = '';
            }

        } else {
            ob.backgrounds_fieldset_filler_top_none_cls = 'none';
            ob.backgrounds_fieldset_filler_bottom_none_cls = 'none';
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
