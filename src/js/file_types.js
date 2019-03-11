import * as r from 'ramda';

const create_pair = (arr, key, val) => {
    for (const item of arr) {
        con[key][item] = val;
    }
};

const backgrounds = ['image/png', 'image/jpeg', 'image/gif'];
const videos = ['video/mp4', 'video/webm', 'video/ogg'];

const colors = ['color', 'color_theme'];
const links = ['img_link'];
const img_files = ['img_file', 'img_file_theme'];
const video_files = ['video_file', 'video_file_theme'];

const files = r.union(img_files, video_files);

export const con = {
    exts: {},
    types: {},
    files: {},
};

create_pair(backgrounds, 'exts', 'img_file');
create_pair(videos, 'exts', 'video_file');

create_pair(colors, 'types', 'colors');
create_pair(links, 'types', 'links');
create_pair(img_files, 'types', 'img_files');
create_pair(video_files, 'types', 'video_files');

create_pair(files, 'files', 'files');
