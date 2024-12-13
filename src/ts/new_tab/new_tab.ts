import { init_shared, d_data } from '@loftyshaky/shared/shared';
import { init } from 'new_tab/internal';

(async () => {
    await ext.send_msg_resp({ msg: 'wait_until_cache_polulated' });
    ext.force_local_storage_f();
    await d_data.Settings.set_from_storage();
    await show_unable_to_access_settings_error();

    init_shared();
    await init();
})();
