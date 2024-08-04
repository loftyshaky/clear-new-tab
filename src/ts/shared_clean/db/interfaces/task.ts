import { i_data } from 'shared_clean/internal';

export interface Task extends i_data.Date {
    id: string;
    i: string;
    background_id: string;
}
