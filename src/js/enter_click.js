export const simulate_click_on_enter = e => {
    try {
        if (e.keyCode === sta.enter_key_code) {
            document.activeElement.click();
        }

    } catch (er) {
        err(er, 212);
    }
};

export const sta = {
    enter_key_code: 13,
};
