import { MockPromiseWrapper } from './mockPromise';

class MockConsumer {
    public result = '';
    constructor(private service: any) {}

    test() {
        this.service.getData().then(data => {
            this.result = data;
        });
    }
}

describe('MockPromiseWrapper', () => {
    it('should resolve correctly', done => {
        let unit = new MockPromiseWrapper<string>();
        let mockService = {
            getData: jasmine.createSpy().and.returnValue(unit.promise)
        };

        let mockConsumer = new MockConsumer(mockService);
        mockConsumer.test();

        expect(mockConsumer.result).toEqual('');

        unit.resolve('test').then(() => {
            // setTimeout(() => {
            expect(mockConsumer.result).toEqual('test');
            done();
            // }, 0);
        });
    });
});
