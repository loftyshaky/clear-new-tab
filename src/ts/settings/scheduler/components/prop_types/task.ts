import { i_db } from 'shared/internal';

export interface Task {
    key: string | number;
    index: number;
    style?: React.CSSProperties;
    task: i_db.Task;
    dragged: boolean;
}
