export class TestDataFactory<T> {
  constructor(private generatorFn: () => T) {}

  getOne(override: any = {}): T {
    return {
      ...this.generatorFn(),
      ...override
    };
  }

  getMany(length: number = 20, overrides: any[] = []): T[] {
    return Array.from(new Array(length)).map((_, i) => this.getOne(overrides[i]));
  }

  extend(newGeneratorFn: (baseData: T) => Partial<T>) {
    return new TestDataFactory<any>(() => newGeneratorFn(this.generatorFn()));
  }
}
