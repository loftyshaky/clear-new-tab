import { i_db } from 'shared/internal';

export interface Task {
    index: number;
    style?: React.CSSProperties;
    task: i_db.Task;
    dragged: boolean;
}
