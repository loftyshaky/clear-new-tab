export const app_id: string = 'u6Pgzb39sN2';

export class Main {
    private prefix: string;

    public constructor(prefix: string) {
        this.prefix = prefix;
    }

    public get result(): string {
        return `${this.prefix}_${app_id}`;
    }
}
