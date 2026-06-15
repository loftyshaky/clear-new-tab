import type { t } from '@loftyshaky/shared/shared_clean';
import type { i_backgrounds } from 'shared_clean/internal';
import { s_backgrounds } from 'shared_clean/internal';

class Class {
    private static instance: Class;

    public static get_instance(): Class {
        return this.instance || (this.instance = new this());
    }

    private constructor() {}

    public set_current_background_data = ({
        mode,
        current_background_id,
        future_background_id,
        force = false,
    }: {
        mode: string;
        current_background_id?: string | number;
        future_background_id?: string | number;
        force?: boolean;
    }): Promise<void> =>
        err_async(async () => {
            if (env.browser === 'firefox' && page === 'background') {
                const { s_backgrounds } = await import('offscreen/internal');

                await s_backgrounds.CurrentBackground.set_current_background_data({
                    mode,
                    current_background_id,
                    future_background_id,
                    force,
                });
            } else {
                await ext.send_msg_resp({
                    msg: 'set_current_background_data',
                    mode,
                    current_background_id,
                    future_background_id,
                    force,
                });
            }
        }, 'cnt_1544');

    public get_background_width_height_and_thumbnail = ({
        file,
        file_type,
    }: {
        file: File | string | undefined;
        file_type: string;
    }): Promise<i_backgrounds.BackgroundImgProps> =>
        err_async(async () => {
            if (env.browser === 'firefox') {
                return s_backgrounds.Thumbnail.get_background_width_height_and_thumbnail({
                    file: file,
                    file_type: file_type,
                });
            }

            return ext.send_msg_resp({
                msg: 'get_background_width_height_and_thumbnail',
                file,
                file_type,
            }) as t.Any;
        }, 'cnt_1545');

    public append_chunk_to_background_file_base64 = ({ chunk }: { chunk: string }): Promise<void> =>
        err_async(async () => {
            if (env.browser === 'firefox') {
                s_backgrounds.Thumbnail.append_chunk_to_background_file_base64({
                    chunk,
                });
            } else {
                await ext.send_msg_resp({
                    msg: 'append_chunk_to_background_file_base64',
                    chunk,
                });
            }
        }, 'cnt_1546');
}

export const FirefoxMsgsAlt = Class.get_instance();
