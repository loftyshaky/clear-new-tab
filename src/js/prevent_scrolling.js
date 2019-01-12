export const mut = {
    delta_y: 3,
};

export const prevent_scrolling = function prevent_scrolling(e) {
    if (this) {
        const scroll_height = this.scrollHeight;
        const client_height = this.clientHeight;
        const scroll_top = this.scrollTop;
        mut.delta_y = e.deltaY;
        const container_is_scrollable = scroll_height > client_height;
        const at_the_top_of_container = mut.delta_y < 0 && scroll_top === 0;
        const at_the_bottom_of_container = mut.delta_y > 0 && scroll_top === scroll_height - client_height;

        if (container_is_scrollable && (at_the_top_of_container || at_the_bottom_of_container)) {
            e.preventDefault();
        }
    }
};
