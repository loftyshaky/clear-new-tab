import { init_shared } from '@loftyshaky/shared';
import { d_settings } from 'shared/internal';
import { init } from 'settings/internal';

(async () => {
    await d_settings.Main.i().set_from_storage();

    init_shared();
    await init();
})();
