export class MockPromiseWrapper<T> {
    // tslint:disable: variable-name
    private _resolve: (value?: T) => void;
    private _reject: (reason?: T) => void;
    promise = new Promise<T>((resolve, reject) => {
        this._resolve = resolve;
        this._reject = reject;
    });
    result: T;
    resolve(value?: T): Promise<void> {
        this._resolve(value);
        return new Promise<void>((resolve, _reject) => {
            resolve();
        });
    }
    reject(reason?: T): Promise<void> {
        this._reject(reason);
        return new Promise<void>((resolve, _reject) => {
            resolve();
        });
    }
}
