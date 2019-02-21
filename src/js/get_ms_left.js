//> get number of ms left till change interval elpse (may be negative)
export const get_ms_left = async () => {
    try {
        const ed_all = await eda();
        const time = new Date().getTime();
        const ms_left = ed_all.change_interval - (time - ed_all.last_img_change_time);

        return ms_left;

    } catch (er) {
        err(er, 13, null, true);
    }

    return undefined;
};
//< get number of ms left till change interval elpse (may be negative)
