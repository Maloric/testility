class RandomDataFactory<T> {
    constructor(private generatorFn: (...args: any[]) => T) {}

    getOne(...args: any[]): T {
        return this.generatorFn(...args);
    }

    getMany(length: number = 20, ...args: any[]): T[] {
        return Array.from(new Array(length)).map((_, i) => this.getOne(...args));
    }
}

export const RANDOM_STRING = new RandomDataFactory<string>((length: number = 4) => {
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from(new Array(length))
        .map((_, i) => Math.floor(Math.random() * 62))
        .reduce((word, i) => word + letters[i], '');
});

export const RANDOM_NUMBER = new RandomDataFactory<number>((min: number = 0, max: number = 100) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
});

export const RANDOM_BOOLEAN = new RandomDataFactory<boolean>(
    (falseThreshold: number = 0.5) => Math.random() > falseThreshold
);

export const RANDOM_OBJECT = new RandomDataFactory<any>((propCount: number = 4) => {
    return Array.from(new Array(propCount)).reduce((obj, _, i) => {
        const fieldName = `field${i}_${RANDOM_STRING.getOne()}`;
        const fieldType = [RANDOM_STRING, RANDOM_NUMBER, RANDOM_BOOLEAN][RANDOM_NUMBER.getOne(0, 2)];

        const isArray = RANDOM_BOOLEAN.getOne();

        obj[fieldName] = isArray ? fieldType.getMany(RANDOM_NUMBER.getOne(0, 20)) : fieldType.getOne();
        return obj;
    }, {});
});
