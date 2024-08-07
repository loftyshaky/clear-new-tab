import { i_backgrounds } from 'shared_clean/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public get_file_type = ({ file }: { file: File | string }): i_backgrounds.FileType =>
        err(() => {
            if (typeof file !== 'string') {
                // some themes don't have file type in theme_ntp_background. Example: https://chrome.google.com/webstore/detail/hatsune-miku/kigfdicgjnpjkhbnngdfgjfffmdaonfg

                const is_video: boolean = ['video/mp4', 'video/webm', 'video/ogg'].some(
                    (file_type: string): boolean =>
                        err(() => file_type === file.type, 'cnt_1148', { silent: true }),
                );

                if (!is_video) {
                    return 'img_file';
                }

                if (is_video) {
                    return 'video_file';
                }
            }

            return 'img_link';
        }, 'cnt_1149');

    public is_base64 = ({ file }: { file: File | string }): boolean =>
        err(() => (typeof file === 'string' ? file.includes('data:') : false), 'cnt_1511');
}

export const FileType = Class.get_instance();
