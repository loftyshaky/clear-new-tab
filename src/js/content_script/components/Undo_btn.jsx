import React from 'react';
import { observer } from 'mobx-react';

import x from 'x';
import * as installing_theme from 'content_script/installing_theme';
import { Tr } from 'js/components/Tr';

export const Undo_btn = observer(() => {
    const undo_theme = () => {
        installing_theme.undo_theme(installing_theme.mut.previous_installed_theme_theme_id);
    };

    return (
        <Tr
            attr={{}}
            tag="div"
            name="gen"
            state={installing_theme.ob.show_undo_btn}
        >
            <button
                type="button"
                className="btn undo_btn"
                onClick={undo_theme}
            >
                {x.msg('undo_btn_text')}
            </button>
        </Tr>
    );
});
