import { d_data, init_shared } from '@loftyshaky/shared/shared';
import { init } from 'new_tab/internal';

void (async () => {
    await ext.send_msg_resp({ msg: 'wait_until_cache_polulated' });
    ext.force_local_storage_f();
    await d_data.Settings.set_from_storage();
    show_unable_to_access_settings_error();

    init_shared();
    await init();
})();
