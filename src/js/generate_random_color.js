'use_strict';

export const generate_random_color = () => {
    try {
        const letters = '0123456789ABCDEF';
        let color = '#';

        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }

        return color;

    } catch (er) {
        err(er, 16);
    }

    return undefined;
};

export const generate_random_pastel_color = () => {
    try {
        return `hsl(${360 * Math.random()},${25 + 70 * Math.random()}%,${70 + 10 * Math.random()}%)`;

    } catch (er) {
        err(er, 17);
    }

    return undefined;
};
