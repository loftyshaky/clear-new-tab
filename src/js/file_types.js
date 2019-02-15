import * as r from 'ramda';

const create_pair = (arr, key, val) => {
    for (const item of arr) {
        con[key][item] = val;
    }
};

const imgs = ['image/png', 'image/jpeg', 'image/gif'];
const videos = ['video/mp4'];

const colors = ['color', 'color_theme', 'theme_color']; // 'theme_color' left for backwards compability
const links = ['img_link', 'link']; // 'link' left for backwards compability
const img_files = ['img_file', 'img_file_theme', 'file', 'theme_file']; // 'file', 'theme_file' left for backwards compability
const video_files = ['video_file', 'video_file_theme'];

const files = r.union(img_files, video_files);

export const con = {
    exts: {},
    types: {},
    files: {},
};

create_pair(imgs, 'exts', 'img_file');
create_pair(videos, 'exts', 'video_file');

create_pair(colors, 'types', 'colors');
create_pair(links, 'types', 'links');
create_pair(img_files, 'types', 'img_files');
create_pair(video_files, 'types', 'video_files');

create_pair(files, 'files', 'files');
