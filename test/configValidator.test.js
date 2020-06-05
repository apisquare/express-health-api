const chai = require('chai');
const expect = chai.expect;
const configValidator = require('../src/configValidator');
const defaultConfig = require('../src/configs/defaultConfig');

let customConfig = {}

describe('should validate configurations through configValidator', () => {

    beforeEach(() => {
        customConfig = {
            isDefault: false,
            apiPath: '/test-status',
            mode: "ON_REQUEST",
            consumedServicesAsyncMode: true,
            consumedServices: {},
            apis: {}
          }
    })
    it('should return default config if custom config does not present', () => {
        const config = configValidator();
        expect(config).not.null;
        expect(config).to.haveOwnProperty("isDefault");
        expect(config.isDefault).is.true;
    });

    it('should not return default config if custom config is present', () => {
        expect(customConfig).not.null;
        const config = configValidator(customConfig);
        expect(config).not.null;
        expect(config).to.haveOwnProperty("isDefault");
        expect(config.isDefault).is.false;
    });

    it ('should set default path if custom config does not have path', () => {
        customConfig.apiPath = "";
        expect(customConfig.apiPath).is.empty;
        const config = configValidator(customConfig);
        expect(config.apiPath).is.not.empty;
        expect(config.apiPath).is.equal(defaultConfig.apiPath)
    });

    it ('should not set default path if custom config has a valid path', () => {
        expect(customConfig.apiPath).is.not.empty;
        const config = configValidator(customConfig);
        expect(config.apiPath).is.not.empty;
        expect(config.apiPath).is.equal(customConfig.apiPath)
    });

    it ('should set default mode if custom config does not have consumedServicesAsyncMode', () => {
        customConfig.consumedServicesAsyncMode = undefined;
        expect(customConfig.consumedServicesAsyncMode).is.undefined;
        const config = configValidator(customConfig);
        expect(config.consumedServicesAsyncMode).is.not.undefined;
        expect(config.consumedServicesAsyncMode).is.equal(defaultConfig.consumedServicesAsyncMode)
    });

    it ('should not set default consumedServicesAsyncMode if custom config has a valid consumedServicesAsyncMode', () => {
        customConfig.consumedServicesAsyncMode = false;
        expect(customConfig.consumedServicesAsyncMode).is.not.undefined;
        const config = configValidator(customConfig);
        expect(config.consumedServicesAsyncMode).is.not.undefined;
        expect(config.consumedServicesAsyncMode).is.equal(customConfig.consumedServicesAsyncMode)
    });

    describe("should validate response configurations", () => {
        it ('should set default response config if custom config does not have valid response config', () => {
            expect(customConfig.response).is.undefined;
            const config = configValidator(customConfig);
            expect(config.response).is.not.undefined;
            expect(config.response).is.equal(defaultConfig.response)
        });

        it ("should set response.statusCodes if custom config does not have", () => {
            customConfig.response = {}
            expect(customConfig.response.statusCodes).is.undefined;
            const config = configValidator(customConfig);
            expect(config.response.statusCodes).is.not.undefined;
            expect(config.response.statusCodes).is.equal(defaultConfig.response.statusCodes)
        })

        it ("should set valid response.statusCodes if custom config have a invalid property", () => {
            customConfig.response = { statusCodes: 'foo' }
            expect(customConfig.response.statusCodes).is.not.undefined;
            expect(typeof customConfig.response.statusCodes).is.not.equal(typeof true)
            const config = configValidator(customConfig);
            expect(config.response.statusCodes).is.not.undefined;
            expect(typeof customConfig.response.statusCodes).is.equal(typeof true);
            expect(config.response.statusCodes).is.equal(defaultConfig.response.statusCodes)
        })
    })
});