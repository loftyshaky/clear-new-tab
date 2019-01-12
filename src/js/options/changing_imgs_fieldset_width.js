import { observable, action, configure } from 'mobx';

configure({ enforceActions: 'observed' });

//> set imgs width same as imgs_w
export const resize_imgs = action(imgs_w => {
    ob.imgs_width = `${imgs_w.offsetWidth}px`;
});
//< set imgs width same as imgs_w

export const ob = observable({
    imgs_width: '',
});
