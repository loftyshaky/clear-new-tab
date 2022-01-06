import { init_shared } from '@loftyshaky/shared';
import { InitAll } from 'shared/init_all';
import { d_settings } from 'shared/internal';
import 'new_tab/internal';

(async () => {
    await d_settings.Main.i().set_from_storage();

    init_shared();
    InitAll.i().init();
})();
