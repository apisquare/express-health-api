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
            consumedServices: {
                mockId: {
                    serviceName: 'mock service',
                    healthCheckUrl: '/',
                    requestMethod: 'GET',
                    expectedResponseStatus: '200',
                    isRequired: true
                }
            },
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
        const config = configValidator(customConfig);
        expect(config.consumedServicesAsyncMode).is.not.undefined;
        expect(config.consumedServicesAsyncMode).is.equal(defaultConfig.consumedServicesAsyncMode)
    });

    it ('should not set default consumedServicesAsyncMode if custom config has a valid consumedServicesAsyncMode', () => {
        customConfig.consumedServicesAsyncMode = false;
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
            // TODO: Check this type of assert
            expect(typeof customConfig.response.statusCodes).is.not.equal("boolean")
            const config = configValidator(customConfig);
            expect(config.response.statusCodes).is.not.undefined;
            expect(typeof customConfig.response.statusCodes).is.equal("boolean");
            expect(config.response.statusCodes).is.equal(defaultConfig.response.statusCodes)
        })
    })

    describe("should validate consumed services configurations", () => {
        it ('should set default config if custom config does not have valid consumedServices config', () => {
            customConfig.consumedServices = undefined;
            const config = configValidator(customConfig);
            expect(config.consumedServices).is.not.undefined;
            expect(config.consumedServices).is.empty
        });

        it ('should not set default config if custom config has valid consumedServices config', () => {
            customConfig.consumedServices = { mockId: {}};
            const config = configValidator(customConfig);
            expect(config.consumedServices).is.not.empty;
            expect(config.consumedServices).is.equal(customConfig.consumedServices)
            expect(config.consumedServices).is.not.equal(defaultConfig.consumedServices)
        });

        it ('should set default serviceName if custom config does not have a valid property', () => {
            customConfig.consumedServices.mockId.serviceName = undefined;
            const config = configValidator(customConfig);
            expect(config.consumedServices.mockId.serviceName).is.not.undefined;
            expect(config.consumedServices.mockId.serviceName).is.equal(defaultConfig.consumedServices.defaultServiceId.serviceName)
        });

        it ('should not set default serviceName if custom config has valid property', () => {
            expect(customConfig.consumedServices.mockId.serviceName).is.not.undefined;
            const config = configValidator(customConfig);
            expect(config.consumedServices.mockId.serviceName).is.not.undefined;
            expect(config.consumedServices.mockId.serviceName).is.equal(customConfig.consumedServices.mockId.serviceName)
            expect(config.consumedServices.mockId.serviceName).is.not.equal(defaultConfig.consumedServices.defaultServiceId.serviceName)
        });

        it ('should set service.isValid=False if custom config does not have a valid healthCheckURL', () => {
            customConfig.consumedServices.mockId.healthCheckUrl = undefined;
            const config = configValidator(customConfig);
            expect(config.consumedServices.mockId.healthCheckUrl).is.undefined;
            expect(config.consumedServices.mockId.isValid).is.false;
        });

        it ('should set default service.requestMethod if custom config does not have a valid property', () => {
            customConfig.consumedServices.mockId.requestMethod = undefined;
            const config = configValidator(customConfig);
            expect(config.consumedServices.mockId.requestMethod).is.not.undefined;
            expect(config.consumedServices.mockId.requestMethod).is.equal(defaultConfig.consumedServices.defaultServiceId.requestMethod)
        });

        it ('should set service.isValid=False if custom config does not have a valid requestMethod', () => {
            customConfig.consumedServices.mockId.requestMethod = 'GET_MOCK';
            const config = configValidator(customConfig);
            expect(config.consumedServices.mockId.isValid).is.false;
        });

        it ('should accept requestMethod without any case sensitive restrictions', () => {
            customConfig.consumedServices.mockId.requestMethod = 'get';
            let config = configValidator(customConfig);
            expect(config.consumedServices.mockId.requestMethod).is.equal('GET');
            expect(config.consumedServices.mockId.isValid).is.true;

            customConfig.consumedServices.mockId.requestMethod = 'Get';
            config = configValidator(customConfig);
            expect(config.consumedServices.mockId.requestMethod).is.equal('GET');
            expect(config.consumedServices.mockId.isValid).is.true;

            customConfig.consumedServices.mockId.requestMethod = 'gEt';
            config = configValidator(customConfig);
            expect(config.consumedServices.mockId.requestMethod).is.equal('GET');
            expect(config.consumedServices.mockId.isValid).is.true;
        });

        it ('should set default service.expectedResponseStatus if custom config does not have a valid property', () => {
            customConfig.consumedServices.mockId.expectedResponseStatus = undefined;
            const config = configValidator(customConfig);
            expect(config.consumedServices.mockId.expectedResponseStatus).is.not.undefined;
            expect(config.consumedServices.mockId.expectedResponseStatus).is.equal(defaultConfig.consumedServices.defaultServiceId.expectedResponseStatus)
        });

        it ('should set default service.isRequired if custom config does not have a valid property', () => {
            customConfig.consumedServices.mockId.isRequired = undefined;
            let config = configValidator(customConfig);
            expect(config.consumedServices.mockId.isRequired).is.not.undefined;
            expect(config.consumedServices.mockId.isRequired).is.equal(defaultConfig.consumedServices.defaultServiceId.isRequired)

            customConfig.consumedServices.mockId.isRequired = "ABC";
            config = configValidator(customConfig);
            expect(config.consumedServices.mockId.isRequired).is.not.equals("ABC");
            expect(config.consumedServices.mockId.isRequired).is.equal(defaultConfig.consumedServices.defaultServiceId.isRequired)
        });
    });

    describe("should validate api configurations", () => {
        it ('should set default config if custom config does not have valid apis config', () => {
            customConfig.apis = undefined;
            const config = configValidator(customConfig);
            expect(config.apis).is.not.undefined;
            expect(config.apis).is.empty
        });

        it ('should set default apiName if custom config does not have valid property', () => {
            customConfig.apis = { mockId: {}};
            const config = configValidator(customConfig);
            expect(config.apis.mockId.apiName).is.not.undefined;
            expect(config.apis.mockId.apiName).is.equal(defaultConfig.apis.defaultApi.apiName)
        });

        it ('should set default requestMethod if custom config does not have valid property', () => {
            customConfig.apis = { mockId: {}};
            let config = configValidator(customConfig);
            expect(config.apis.mockId.requestMethod).is.not.undefined;
            expect(config.apis.mockId.requestMethod).is.equal(defaultConfig.apis.defaultApi.requestMethod)

            customConfig.apis = { mockId: { requestMethod: "GET_UPPER" }};
            config = configValidator(customConfig);
            expect(config.apis.mockId.requestMethod).is.not.equal("GET_UPPER");
            expect(config.apis.mockId.requestMethod).is.equal(defaultConfig.apis.defaultApi.requestMethod)
        });

        it ('should set default dependsOn config if custom config does not have valid property', () => {
            customConfig.apis = { mockId: {}};
            let config = configValidator(customConfig);
            expect(config.apis.mockId.dependsOn).is.not.undefined;
            expect(config.apis.mockId.dependsOn).is.instanceOf(Array)

            customConfig.apis = { mockId: { dependsOn: {}}};
            config = configValidator(customConfig);
            expect(config.apis.mockId.dependsOn).is.instanceOf(Array)

        });
    });
});