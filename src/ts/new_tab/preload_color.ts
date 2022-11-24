const set_preload_color = (): void => {
    const preload_color = localStorage.getItem('preload_color');

    const style: HTMLStyleElement = document.createElement('style');
    style.innerHTML = `html,body{background-color:${preload_color};}`;
    document.head.appendChild(style);
};

set_preload_color();
