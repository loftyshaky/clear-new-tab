export const convert_to_file_object = (blob, type) => new window.File([blob], '', { type: type || blob.type }); // '' is file name, it means that file object was created from blob objec
