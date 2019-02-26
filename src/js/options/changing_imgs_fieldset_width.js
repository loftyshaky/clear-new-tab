import { observable, action, configure } from 'mobx';

configure({ enforceActions: 'observed' });

//> set imgs element width same as imgs_w
export const resize_imgs = action(imgs_w => {
    try {
        ob.imgs_width = `${imgs_w.offsetWidth}px`;

    } catch (er) {
        err(er, 98);
    }
});
//< set imgs element width same as imgs_w

export const ob = observable({
    imgs_width: '',
});
