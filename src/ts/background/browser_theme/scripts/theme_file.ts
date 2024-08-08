import upperFirst from 'lodash/upperFirst';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    // eslint-disable-next-line no-useless-constructor, no-empty-function
    private constructor() {}

    public valid_img_file_types: string[] = ['gif', 'jpeg', 'jpg', 'png'];
    public clear_new_tab_video_file_names: string[] = [
        'clear_new_tab_video.mp4',
        'clear_new_tab_video.webm',
        'clear_new_tab_video.ogv',
        'clear_new_tab_video.gif',
    ];

    public extract_file = ({
        theme_package_data,
        img_file_name,
        clear_new_tab_video_file_name,
    }: {
        theme_package_data: any;
        img_file_name: string | undefined;
        clear_new_tab_video_file_name: string | undefined;
    }): Promise<File> =>
        err_async(
            async () => {
                const clear_new_tab_video_file = await theme_package_data.file(
                    clear_new_tab_video_file_name,
                );
                const img_file = await theme_package_data.file(img_file_name); // download theme image
                const img_file_final = n(img_file)
                    ? img_file
                    : await theme_package_data.file(upperFirst(img_file)); // download theme image (convert first letter of image name to uppercase);
                const is_img_file: boolean = !n(clear_new_tab_video_file_name);
                const file_type: string = `${is_img_file ? 'image/' : 'video/'}${this.get_file_ext({
                    file_name: is_img_file ? img_file_name : clear_new_tab_video_file_name,
                })}`;
                const blob = await (n(clear_new_tab_video_file)
                    ? clear_new_tab_video_file
                    : img_file_final
                ).async('blob');
                const file = this.convert_to_file_object({ blob, file_type });

                return file;
            },
            'cnt_1177',
            { silent: true },
        );

    private get_file_ext = ({ file_name }: { file_name: string | undefined }): string =>
        err(() => {
            let ext: string = n(file_name) ? file_name.split('.').pop() || '' : '';

            if (ext === 'jpg') {
                ext = 'jpeg';
            } else if (ext === 'ogv') {
                ext = 'ogg';
            }

            return ext;
        }, 'cnt_1178');

    private convert_to_file_object = ({
        blob,
        file_type,
    }: {
        blob: Blob;
        file_type: string;
    }): File => err(() => new globalThis.File([blob], '', { type: file_type }), 'cnt_1179');
}

export const ThemeFile = Class.get_instance();
