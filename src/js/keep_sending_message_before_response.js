// fix for 3/16/19 10:15 AM bug in chrome 73

import x from 'x';

export const keep_sending_message_before_response = async message => {
    const receiving_end_doesnt_exist = 'Could not establish connection. Receiving end does not exist.';
    let response;
    let iteration_count = 0;

    while ((response == null || response.message === receiving_end_doesnt_exist) && iteration_count < 200) { // loaded_background == null catches undefined and null
        response = await x.send_message_to_background_c_no_reject({ message }); // eslint-disable-line no-await-in-loop

        const receiving_end_doesnt_exist_error_occured = response != null && response.message && response.message === receiving_end_doesnt_exist;

        if (receiving_end_doesnt_exist_error_occured) {
            err(response, 283, null, true, false, false, true);
        }

        iteration_count++;
    }

    return response;
};
