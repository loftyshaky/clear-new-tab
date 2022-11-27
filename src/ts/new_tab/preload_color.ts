export const set_preload_color = (): void => {
    const preload_color = localStorage.getItem('preload_color');
    const old_preload_color_style: HTMLStyleElement | null =
        document.head.querySelector('preload_color');

    const set_preload_color_inner = (preload_color_style: HTMLStyleElement | null) => {
        if (preload_color_style) {
            preload_color_style.innerHTML = `html,body{background-color:${preload_color};}`;
        }
    };

    if (old_preload_color_style) {
        set_preload_color_inner(old_preload_color_style);
    } else {
        const new_preload_color_style: HTMLStyleElement = document.createElement('style');
        new_preload_color_style.className = 'preload_color';

        set_preload_color_inner(new_preload_color_style);

        document.head.appendChild(new_preload_color_style);
    }
};

set_preload_color();
