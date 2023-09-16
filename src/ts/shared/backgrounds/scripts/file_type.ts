import { i_backgrounds } from 'shared/internal';

export class FileType {
    private static i0: FileType;

    public static i(): FileType {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
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
