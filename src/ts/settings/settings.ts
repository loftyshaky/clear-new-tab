import { init_shared } from '@loftyshaky/shared';
import { d_settings } from 'shared/internal';
import { init } from 'settings/internal';
import { InitAll } from 'shared/init_all';

(async () => {
    await d_settings.Main.i().set_from_storage();

    init_shared();
    init();
    InitAll.i().init();
})();
