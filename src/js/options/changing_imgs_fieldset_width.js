//> set imgs width same as imgs_w t

//> varibles t

//^

import { observable, action, configure } from 'mobx';

configure({ enforceActions: true });

//> set imgs width same as imgs_w t
export const resize_imgs = action(imgs_w => {
    ob.imgs_width = `${imgs_w.offsetWidth}px`;
});
//< set imgs width same as imgs_w t

//> varibles t
export const ob = observable({
    imgs_width: '',
});
//< varibles t
