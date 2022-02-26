export class RandomSolidColor {
    private static i0: RandomSolidColor;

    public static i(): RandomSolidColor {
        // eslint-disable-next-line no-return-assign
        return this.i0 || (this.i0 = new this());
    }

    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    private constructor() {}

    public generate = (): string =>
        err(
            () =>
                `hsl(${360 * Math.random()},${25 + 70 * Math.random()}%,${
                    70 + 10 * Math.random()
                }%)`,
            'cnt_64356',
        );
}
