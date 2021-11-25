import { i_db } from 'shared/internal';

export interface Background {
    key: number;
    style: React.CSSProperties;
    background: i_db.Background;
}
