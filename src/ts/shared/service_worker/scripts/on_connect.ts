import { Runtime } from 'webextension-polyfill-ts';

import { s_service_worker } from 'shared/internal';

we.runtime.onConnect.addListener(
    (port: Runtime.Port): Promise<void> =>
        err_async(async () => {
            if (port.name === 'keep_alive') {
                globalThis.clearTimeout(s_service_worker.Lifeline.i().keep_alive_forced_timeout);

                s_service_worker.Lifeline.i().lifeline = port;

                s_service_worker.Lifeline.i().keep_alive_forced_timeout = self.setTimeout(
                    s_service_worker.Lifeline.i().disconnect,
                    5000,
                ); // 300000 - 5000 = 295000 - 5 minutes minus 5 seconds

                port.onDisconnect.addListener(s_service_worker.Lifeline.i().connect);
            }
        }, 'cnt_1035'),
);