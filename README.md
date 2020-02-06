# Testility

This package contains a few useful tools for writing unit tests in Typescript or JavaScript.

## Random Data Generators

Whenever you need to generate a random number, string, boolean or object, use these classes to generate the data for you. Here's how:

    import { RANDOM_NUMBER, RANDOM_STRING, RANDOM_BOOLEAN, RANDOM_OBJECT } from '../testility';

    // All random data generators include getOne and getMany methods
    // The latter allows you to specify the number of records (default 20)

    // You can control the min/max value for random numbers
    let randomNumber = RANDOM_NUMBER.getOne();
    let randomNumbers = RANDOM_NUMBER.getMany();
    let twentyRandomNumbers = RANDOM_NUMBER.getMany(20);
    let randomNumberBetween50And100 = RANDOM_NUMBER.getOne(50, 100);
    let twentyRandomNumbersBetween50And100 = RANDOM_NUMBER.getOne(20, 50, 100);

    // You can control the length of random strings
    let randomString = RANDOM_STRING.getOne();
    let randomStringOfTenCharacters = RANDOM_STRING.getOne(10);
    let threeRandomStrings = RANDOM_STRING.getMany(3);
    let threeRandomCharacters = RANDOM_STRING.getMany(3, 1);

    // You can control the false threshold for random booleans
    let randomBoolean = RANDOM_BOOLEAN.getOne();
    let randomBoolean90PercentFalse = RANDOM_BOOLEAN.getOne(0.9);
    let randomBooleans = RANDOM_BOOLEAN.getMany();
    let fourRandomBooleans = RANDOM_BOOLEAN.getMany(4);
    let fiftyRandomBooleansEightPercentTrue = RANDOM_BOOLEAN.getMany(50, 0.2);

    // You can control the number of properties on a random object
    // Random objects include random properties and values, including array values
    let randomObject = RANDOM_OBJECT.getOne();
    let randomObjectWithTwoProperties = RANDOM_OBJECT.getOne(2);
    let randomObjects = RANDOM_OBJECT.getMany();
    let tenRandomObjects = RANDOM_OBJECT.getMany(10);
    let tenRandomObjectsWithOnlyOneProperty = RANDOM_OBJECT.getMany(10, 1);

## TestDataFactory

Based on a blog post I made called "[Stop Filling Your Tests with Test Data](https://medium.com/better-programming/stop-filling-your-tests-with-test-data-4eaa151bfe31)", this super simple class gives you an easy way to create factories that generate test data for you. You provide a method to generate a single record, and you get back a Factory to generate as many records as you need. You can also override records in your test data in order to make your tests clearer. Here is an example:

    import { TestDataFactory, RANDOM_NUMBER } from 'testility';
    import { Customer } from './models';
    import { CustomerDataService } from './customer.service';

    export const CUSTOMER_FACTORY = new TestDataFactory<Customer>(() => {
        const id = RANDOM_NUMBER.getOne();
        return {
            id,
            firstName: `FIRSTNAME_${id}`,
            lastName: `LASTNAME_${id}`,
            memberLevel: 1
        };
    });

    describe('Customer Service', () => {
        let unit: CustomerDataService;
        let testData: any[];
        beforeEach(() => {
            testData = CUSTOMER_FACTORY.getMany(10, [
                { memberLevel: 3 },
                { memberLevel: 2 }
            ]);

            unit = new CustomerDataService();
        });

        describe('when getPremiumMembers is called', () => {
            let result: any[];
            beforeEach(() => {
                result = unit.getPremiumMembers(testData);
            });

            it('should return only the premium members', () => {
                expect(result.length).toBe(1);
                expect(result[0]).toBe(testData[0]);
            });
        });
    });

## MockPromise

This class provides an easy way to create a mock promise in your tests, which you can resolve at a time of your choosing. This allows you to make assertions before and after the promise resolves.

The wrapper contains a `promise` property, containing the actual promise, a `result` property for storing the return value (this isn't used internally but saves you having to create a separate variable for the return value and means you know where to find it), as well as two methods: `resolve` and `reject`, which allow you to resolve the promise or reject it at a time of your choosing. Here is an example:

    import { MockPromiseWrapper } from 'testility';
    import { PRODUCT_DATA_FACTORY } from './test-data';
    import { ProductListComponent } from './product-component';

    describe('Product List Component', () => {
        let unit: ProductListComponent;
        let mockService: any;
        let mockPromiseWrapper: MockPromiseWrapper<any>;

        beforeEach(() => {
            mockPromiseWrapper = new MockPromiseWrapper();
            mockPromiseWrapper.result = PRODUCT_DATA_FACTORY.getMany(); // you don't have to use this, but it provides a convenient place to store your result - store on a separate variable if you prefer
            mockService = {
                getProducts: jasmine.createSpy().and.returnValue(mockPromiseWrapper.promise)
            };
            unit = new ProductListComponent(mockService);
        });

        it('should remove the loading message once products are loaded', (done) => {
            expect(mockService.getProducts).toHaveBeenCalled();
            expect(unit.element.textContent).toContain('Loading'); // This is the key part - if the promise resolved right away we can't reliably make this assertion

            mockPromiseWrapper.resolve(mockPromiseWrapper.result).then((products) => {
                expect(unit.element.textContent).not.toContain('Loading');
                done();
            });
        });
    });
