import { i_backgrounds } from 'settings/internal';

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
                const is_img: boolean = ['image/png', 'image/jpeg', 'image/gif'].some(
                    (file_type: string): boolean =>
                        err(
                            () => file_type === file.type,

                            'cnt_84260',
                        ),
                );

                const is_video: boolean = ['video/mp4', 'video/webm', 'video/ogg'].some(
                    (file_type: string): boolean => err(() => file_type === file.type, 'cnt_63683'),
                );

                if (is_img) {
                    return 'img';
                }

                if (is_video) {
                    return 'video';
                }
            }

            return 'link';
        }, 'cnt_19345');
}
