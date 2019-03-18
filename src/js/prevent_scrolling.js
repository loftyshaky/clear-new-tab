export const prevent_scrolling = function prevent_scrolling(e) {
    try {
        if (this) {
            const scroll_height = this.scrollHeight;
            const client_height = this.clientHeight;
            const scroll_top = this.scrollTop;
            const delta_y = e.deltaY;
            const container_is_scrollable = scroll_height > client_height;
            const at_the_top_of_container = delta_y < 0 && scroll_top === 0;
            const at_the_bottom_of_container = delta_y > 0 && scroll_top === scroll_height - client_height;

            if (container_is_scrollable && (at_the_top_of_container || at_the_bottom_of_container)) {
                e.preventDefault();
            }
        }

    } catch (er) {
        err(er, 183);
    }
};
