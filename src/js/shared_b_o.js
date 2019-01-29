'use_strict';

import { observable } from 'mobx';

export const blob_to_file = blob => new File([blob], '', { type: blob.type }); // '' is file name, it means that file object was created from blob object

export const ob = observable({
    imgs: [],
});
