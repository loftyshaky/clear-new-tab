import { i_data } from 'shared/internal';

export interface Task extends i_data.Date {
    id: string;
    i: string;
    background_id: string;
}
