import { init_shared } from '@loftyshaky/shared';
import { InitAll } from 'shared/init_all';
import 'new_tab/internal';

(async () => {
    init_shared();
    InitAll.i().init();
})();
