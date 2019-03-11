import { observable, action, configure } from 'mobx';

configure({ enforceActions: 'observed' });

//> set backgrounds element width same as backgrounds_w
export const resize_backgrounds = action(backgrounds_w => {
    try {
        ob.backgrounds_width = `${backgrounds_w.offsetWidth}px`;

    } catch (er) {
        err(er, 98);
    }
});
//< set backgrounds element width same as backgrounds_w

export const ob = observable({
    backgrounds_width: '',
});
