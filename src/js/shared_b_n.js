//> get number of ms left till change interval elpse (may be negative)
export const get_ms_left = () => {
    const time = new Date().getTime();
    const ms_left = ed.change_interval - (time - ed.last_img_change_time);

    return ms_left;
};
//< get number of ms left till change interval elpse (may be negative)
