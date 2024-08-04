import { t } from '@loftyshaky/shared/shared_clean';
import { s_backgrounds as s_backgrounds_shared_clean } from 'shared_clean/internal';
import { s_backgrounds } from 'offscreen/internal';

we.runtime.onMessage.addListener((msg: t.Msg): any =>
    err(() => {
        const msg_str: string = msg.msg;

        if (msg_str === 'set_current_background_data') {
            return s_backgrounds.CurrentBackground.i()
                .set_current_background_data({
                    current_background_id: msg.current_background_id,
                    force: n(msg.force) ? msg.force : false,
                })
                .then(() => true)
                .catch((error_obj: any) => show_err_ribbon(error_obj, 'cnt_1489'));
        }

        if (msg_str === 'get_preloaded_background_data') {
            return s_backgrounds.CurrentBackground.i()
                .set_current_background_data_from_empty({
                    current_background_id: msg.current_background_id,
                })
                .then(() => ({
                    current_background: s_backgrounds.CurrentBackground.i().current_background,
                    current_background_file:
                        s_backgrounds.CurrentBackground.i().current_background_file,
                }))
                .catch((error_obj: any) => show_err_ribbon(error_obj, 'cnt_1490'));
        }

        if (msg_str === 'get_background_width_height_and_thumbnail') {
            return s_backgrounds_shared_clean.Thumbnail.i()
                .get_background_width_height_and_thumbnail({
                    file: msg.file,
                    file_type: msg.file_type,
                })
                .then((response) => response)
                .catch((error_obj: any) => show_err_ribbon(error_obj, 'cnt_1491'));
        }

        if (msg_str === 'append_chunk_to_background_file_base64') {
            s_backgrounds_shared_clean.Thumbnail.i().append_chunk_to_background_file_base64({
                chunk: msg.chunk,
            });

            return Promise.resolve(true);
        }

        return false;
    }, 'cnt_1474'),
);
