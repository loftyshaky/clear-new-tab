import { i_db } from 'shared/internal';

export interface Background {
    index: number;
    style: React.CSSProperties;
    background: i_db.Background;
    dragged: boolean;
}
