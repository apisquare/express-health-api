const chai = require('chai');
const expect = chai.expect;
const doHealthCheck = require('../src/doHealthCheck');
const configValidator = require('../src/configValidator');
const { axios } = require('../src/utils/imports');
const MockAdapter = require("axios-mock-adapter");

const mockHappyPathUrl = 'https://test-url/happy';
const mockBadPathUrl = 'https://test-url/bad';
const mockErrorPathUrl = 'https://test-url/error';

describe("should doHealthCheck provide proper health response based on response", () => {
  before(() => {
    var mock = new MockAdapter(axios);
    mock.onGet(mockHappyPathUrl).reply(200, { content: 'testing data', duration: 100 });
    mock.onGet(mockBadPathUrl).reply(404);
    mock.onGet(mockErrorPathUrl).reply(() => {
      throw new Error('Unknown Error')
    })
  })

  it("should return proper response for default config", async () => {
    const config = configValidator();
    expect(config.isDefault).true;
    const response = await doHealthCheck(config);
    expect(response).haveOwnProperty("status");
    expect(response.status).is.equal("up");
    expect(response).haveOwnProperty("consumedServiceStatus");
    expect(response.consumedServiceStatus).to.be.empty;
    expect(response).haveOwnProperty("apiStatus");
    expect(response.apiStatus).to.be.empty;
    expect(response).haveOwnProperty("systemInformation");
    expect(response.systemInformation).to.be.not.empty;
  })

  it("should return proper response for custom config : consumedServicesAsyncMode=False", async () => {
    const customConfig = { 
      apiPath: "/status", 
      consumedServicesAsyncMode: false,
      consumedServices: {
        service_1: {
          healthCheckUrl: 'https://test-url/happy'
        },
        service_2: {
          healthCheckUrl: 'https://test-url/bad',
        },
        service_3: {
          healthCheckUrl: 'https://test-url/happy',
          expectedResponseStatus: 201
        },
      },
     }
    const config = configValidator(customConfig);
    expect(config.isDefault).false;
    const response = await doHealthCheck(config);
    expect(response).haveOwnProperty("status");
    expect(response.status).is.equal("up");
    expect(response).haveOwnProperty("consumedServiceStatus");
    expect(response.consumedServiceStatus).to.be.not.empty;
    expect(response.consumedServiceStatus).haveOwnProperty("service_1");
    expect(response.consumedServiceStatus.service_1).haveOwnProperty("status");
    expect(response.consumedServiceStatus.service_1.status).is.equal("up");
    expect(response.consumedServiceStatus).haveOwnProperty("service_2");
    expect(response.consumedServiceStatus.service_2).haveOwnProperty("status");
    expect(response.consumedServiceStatus.service_2.status).is.equal("down");
    expect(response.consumedServiceStatus).haveOwnProperty("service_3");
    expect(response.consumedServiceStatus.service_3).haveOwnProperty("status");
    expect(response.consumedServiceStatus.service_3.status).is.equal("down");
    expect(response).haveOwnProperty("apiStatus");
    expect(response.apiStatus).to.be.empty;
    expect(response).haveOwnProperty("systemInformation");
    expect(response.systemInformation).to.be.not.empty;
  })

  it("should return proper response for custom config : expectedResponseStatus", async () => {
    const customConfig = { 
      apiPath: "/status",
      consumedServices: {
        service_1: {
          healthCheckUrl: 'https://test-url/happy',
          expectedResponseStatus: 201
        },
        service_2: {
          healthCheckUrl: 'https://test-url/bad',
          expectedResponseStatus: 201
        },
      },
     }
    const config = configValidator(customConfig);
    expect(config.isDefault).false;
    const response = await doHealthCheck(config);
    expect(response).haveOwnProperty("status");
    expect(response.status).is.equal("up");
    expect(response).haveOwnProperty("consumedServiceStatus");
    expect(response.consumedServiceStatus).to.be.not.empty;
    expect(response.consumedServiceStatus).haveOwnProperty("service_1");
    expect(response.consumedServiceStatus.service_1).haveOwnProperty("status");
    expect(response.consumedServiceStatus.service_1.status).is.equal("down");
    expect(response.consumedServiceStatus).haveOwnProperty("service_2");
    expect(response.consumedServiceStatus.service_2).haveOwnProperty("status");
    expect(response.consumedServiceStatus.service_2.status).is.equal("down");
    expect(response).haveOwnProperty("apiStatus");
    expect(response.apiStatus).to.be.empty;
    expect(response).haveOwnProperty("systemInformation");
    expect(response.systemInformation).to.be.not.empty;
  })

  it("should return proper response for consumed services even any request got error: consumedServicesAsyncMode=False", async () => {
    const customConfig = { 
      apiPath: "/status", 
      consumedServicesAsyncMode: false,
      consumedServices: {
        service_1: {
          healthCheckUrl: 'https://test-url/happy',
        },
        service_2: {
          healthCheckUrl: 'https://test-url/error',
        },
        service_3: {
          healthCheckUrl: 'https://test-url/bad',
        },
      },
     }
    const config = configValidator(customConfig);
    expect(config.isDefault).false;
    const response = await doHealthCheck(config);
    expect(response).haveOwnProperty("status");
    expect(response.status).is.equal("up");
    expect(response).haveOwnProperty("consumedServiceStatus");
    expect(response.consumedServiceStatus).to.be.not.empty;
    expect(response.consumedServiceStatus).haveOwnProperty("service_1");
    expect(response.consumedServiceStatus.service_1).haveOwnProperty("status");
    expect(response.consumedServiceStatus.service_1.status).is.equal("up");
    expect(response.consumedServiceStatus).haveOwnProperty("service_2");
    expect(response.consumedServiceStatus.service_2).haveOwnProperty("status");
    expect(response.consumedServiceStatus.service_2.status).is.equal("down");
    expect(response.consumedServiceStatus).haveOwnProperty("service_3");
    expect(response.consumedServiceStatus.service_3).haveOwnProperty("status");
    expect(response.consumedServiceStatus.service_3.status).is.equal("down");
    expect(response).haveOwnProperty("apiStatus");
    expect(response.apiStatus).to.be.empty;
    expect(response).haveOwnProperty("systemInformation");
    expect(response.systemInformation).to.be.not.empty;
  })

  it("should return proper response for consumed services even any request got error: consumedServicesAsyncMode=True", async () => {
    const customConfig = { 
      apiPath: "/status", 
      consumedServicesAsyncMode: true,
      consumedServices: {
        service_1: {
          healthCheckUrl: 'https://test-url/happy',
        },
        service_2: {
          healthCheckUrl: 'https://test-url/error',
        },
        service_3: {
          healthCheckUrl: 'https://test-url/bad',
        },
      },
     }
    const config = configValidator(customConfig);
    expect(config.isDefault).false;
    const response = await doHealthCheck(config);
    expect(response).haveOwnProperty("status");
    expect(response.status).is.equal("up");
    expect(response).haveOwnProperty("consumedServiceStatus");
    expect(response.consumedServiceStatus).to.be.not.empty;
    expect(response.consumedServiceStatus).haveOwnProperty("service_1");
    expect(response.consumedServiceStatus.service_1).haveOwnProperty("status");
    expect(response.consumedServiceStatus.service_1.status).is.equal("up");
    expect(response.consumedServiceStatus).haveOwnProperty("service_2");
    expect(response.consumedServiceStatus.service_2).haveOwnProperty("status");
    expect(response.consumedServiceStatus.service_2.status).is.equal("down");
    expect(response.consumedServiceStatus).haveOwnProperty("service_3");
    expect(response.consumedServiceStatus.service_3).haveOwnProperty("status");
    expect(response.consumedServiceStatus.service_3.status).is.equal("down");
    expect(response).haveOwnProperty("apiStatus");
    expect(response.apiStatus).to.be.empty;
    expect(response).haveOwnProperty("systemInformation");
    expect(response.systemInformation).to.be.not.empty;
  })

  it("should return proper response for api status : isRequired = True", async () => {
    const customConfig = { 
      apiPath: "/status", 
      consumedServicesAsyncMode: true,
      consumedServices: {
        service_1: {
          healthCheckUrl: 'https://test-url/happy',
        },
        service_2: {
          healthCheckUrl: 'https://test-url/error',
        },
      },
      apis: {
        api_1: {
          dependsOn: [{ serviceId: "service_1"}]
        },
        api_2: {
          dependsOn: [{ serviceId: "service_2"}]
        },
        api_3: {
          dependsOn: [{ serviceId: "service_1"}, { serviceId: "service_2"}]
        }
      }
     }
    const config = configValidator(customConfig);
    expect(config.isDefault).false;
    const response = await doHealthCheck(config);
    expect(response).haveOwnProperty("status");
    expect(response.status).is.equal("up");
    expect(response).haveOwnProperty("consumedServiceStatus");
    expect(response.consumedServiceStatus).to.be.not.empty;
    expect(response.consumedServiceStatus.service_1.status).is.equal("up");
    expect(response.consumedServiceStatus.service_2.status).is.equal("down");
    expect(response).haveOwnProperty("apiStatus");

    expect(config.apis.api_1.dependsOn[0].isRequired).to.be.true;
    expect(config.apis.api_2.dependsOn[0].isRequired).to.be.true;
    expect(config.apis.api_3.dependsOn[0].isRequired).to.be.true;
    expect(config.apis.api_3.dependsOn[1].isRequired).to.be.true;

    expect(response.apiStatus).to.be.not.empty;
    expect(response.apiStatus).haveOwnProperty("api_1");
    expect(response.apiStatus.api_1).haveOwnProperty("status");
    expect(response.apiStatus.api_1.status).is.equal("up");
    expect(response.apiStatus).haveOwnProperty("api_2");
    expect(response.apiStatus.api_2).haveOwnProperty("status");
    expect(response.apiStatus.api_2.status).is.equal("down");
    expect(response.apiStatus).haveOwnProperty("api_3");
    expect(response.apiStatus.api_3).haveOwnProperty("status");
    expect(response.apiStatus.api_3.status).is.equal("down");

    expect(response).haveOwnProperty("systemInformation");
    expect(response.systemInformation).to.be.not.empty;
  })

  it("should return proper response for api status : isRequired = False", async () => {
    const customConfig = { 
      apiPath: "/status", 
      consumedServicesAsyncMode: true,
      consumedServices: {
        service_1: {
          healthCheckUrl: 'https://test-url/bad',
        },
        service_2: {
          healthCheckUrl: 'https://test-url/error',
        },
      },
      apis: {
        api_1: {
          dependsOn: [{ serviceId: "service_1", isRequired: false }]
        },
        api_2: {
          dependsOn: [{ serviceId: "service_2", isRequired: false }]
        },
        api_3: {
          dependsOn: [{ serviceId: "service_1", isRequired: false }, { serviceId: "service_2", isRequired: false }]
        }
      }
     }
    const config = configValidator(customConfig);
    expect(config.isDefault).false;
    const response = await doHealthCheck(config);
    expect(response).haveOwnProperty("status");
    expect(response.status).is.equal("up");
    expect(response).haveOwnProperty("consumedServiceStatus");
    expect(response.consumedServiceStatus).to.be.not.empty;
    expect(response.consumedServiceStatus.service_1.status).is.equal("down");
    expect(response.consumedServiceStatus.service_2.status).is.equal("down");
    expect(response).haveOwnProperty("apiStatus");

    expect(config.apis.api_1.dependsOn[0].isRequired).to.be.false;
    expect(config.apis.api_2.dependsOn[0].isRequired).to.be.false;
    expect(config.apis.api_3.dependsOn[0].isRequired).to.be.false;
    expect(config.apis.api_3.dependsOn[1].isRequired).to.be.false;

    expect(response.apiStatus).to.be.not.empty;
    expect(response.apiStatus).haveOwnProperty("api_1");
    expect(response.apiStatus.api_1).haveOwnProperty("status");
    expect(response.apiStatus.api_1.status).is.equal("up");
    expect(response.apiStatus).haveOwnProperty("api_2");
    expect(response.apiStatus.api_2).haveOwnProperty("status");
    expect(response.apiStatus.api_2.status).is.equal("up");
    expect(response.apiStatus).haveOwnProperty("api_3");
    expect(response.apiStatus.api_3).haveOwnProperty("status");
    expect(response.apiStatus.api_3.status).is.equal("up");

    expect(response).haveOwnProperty("systemInformation");
    expect(response.systemInformation).to.be.not.empty;
  })

  it("should return proper response with warnings if it has wrong serviceIds", async () => {
    const customConfig = { 
      apiPath: "/status", 
      consumedServicesAsyncMode: true,
      consumedServices: {
        service_1: {
          healthCheckUrl: 'https://test-url/happy',
        },
        service_2: {
          healthCheckUrl: 'https://test-url/bad',
        },
      },
      apis: {
        api_1: {
          dependsOn: [{ serviceId: "service_1" }]
        },
        api_2: {
          dependsOn: [{ serviceId: "service_3" }]
        }
      }
     }
    const config = configValidator(customConfig);
    expect(config.isDefault).false;
    const response = await doHealthCheck(config);
    expect(response).haveOwnProperty("status");
    expect(response.status).is.equal("up");
    expect(response).haveOwnProperty("consumedServiceStatus");
    expect(response.consumedServiceStatus).to.be.not.empty;
    expect(response.consumedServiceStatus.service_1.status).is.equal("up");
    expect(response.consumedServiceStatus.service_2.status).is.equal("down");
    expect(response).haveOwnProperty("apiStatus");

    expect(response.apiStatus).to.be.not.empty;
    expect(response.apiStatus).haveOwnProperty("api_1");
    expect(response.apiStatus.api_1).haveOwnProperty("status");
    expect(response.apiStatus.api_1.status).is.equal("up");
    expect(response.apiStatus.api_1).not.haveOwnProperty("warnings");
    expect(response.apiStatus).haveOwnProperty("api_2");
    expect(response.apiStatus.api_2).haveOwnProperty("status");
    expect(response.apiStatus.api_2.status).is.equal("unknown");
    expect(response.apiStatus.api_2).haveOwnProperty("warnings");
    expect(response.apiStatus.api_2.warnings).to.be.not.empty;

    expect(response).haveOwnProperty("systemInformation");
    expect(response.systemInformation).to.be.not.empty;
  })
})