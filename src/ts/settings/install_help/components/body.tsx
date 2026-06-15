import { observer } from 'mobx-react-lite';

import { d_install_help } from 'settings/internal';
import { Tr } from 'shared/internal';

export const Body: React.FunctionComponent = observer(() => {
    return (
        <Tr
            tag='div'
            name='fade'
            cls='install_help'
            state={data.settings.prefs.install_help_is_visible}
        >
            <div
                dangerouslySetInnerHTML={{
                    __html: ext.msg(`install_help_${env.browser}_text`),
                }}
                role='none'
                onClick={d_install_help.Visibility.hide}
            />
        </Tr>
    );
});
