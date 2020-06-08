const chai = require('chai');
const expect = chai.expect;
const connect = require('../src/connect');

let mockRequest = {}
let mockResponse = {}
let mockNext = () => {}
let isNextExecuted = false;

describe("should connect the Health API to express server", () => {
  beforeEach(() => {
    mockRequest = {
      headers: [],
      path: ""
    }
    mockResponse = {
      send: (data) => data
    }
    isNextExecuted = false;
    mockNext = () => isNextExecuted = true;
  });

  it("should move to next(), if the request does not point to health check", () => {
    const customConfig = { apiPath: "/status" }
    const middleware = connect(customConfig);
    mockRequest.path = "/api_name_1";
    expect(mockRequest.path).is.not.equal(customConfig.apiPath);
    expect(isNextExecuted).false;
    middleware(mockRequest, mockResponse, mockNext);
    expect(isNextExecuted).true;
  })

  it("should not move to next() if the request if for health check", () => {
    const customConfig = { apiPath: "/status" }
    const middleware = connect(customConfig);
    mockRequest.path = "/status";
    expect(mockRequest.path).is.equal(customConfig.apiPath);
    expect(isNextExecuted).false;
    middleware(mockRequest, mockResponse, mockNext);
    expect(isNextExecuted).false;
  })

  it("should return the health response for /status API request", async () => {
    const customConfig = { apiPath: "/status" }
    const middleware = connect(customConfig);
    mockRequest.path = "/status";
    expect(mockRequest.path).is.equal(customConfig.apiPath);
    const response = await middleware(mockRequest, mockResponse, mockNext);
    expect(response).haveOwnProperty('status');
    expect(response).haveOwnProperty('consumedServiceStatus');
    expect(response).haveOwnProperty('apiStatus');
    expect(response).haveOwnProperty('systemInformation');
  })

  it("should not send health response with empty token when the config enabled with apiSecurity", async () => {
    const customConfig = { apiPath: "/status", apiSecurity: { headerToken: "$3dsample_token"} }
    const middleware = connect(customConfig);
    mockRequest.path = "/status";
    expect(mockRequest.path).is.equal(customConfig.apiPath);
    expect(isNextExecuted).false;
    const response = await middleware(mockRequest, mockResponse, mockNext);
    expect(response).haveOwnProperty('status');
    expect(response).haveOwnProperty('error');
    expect(response.error).haveOwnProperty('code');
    expect(response.error).haveOwnProperty('message');
    expect(response.error.code).is.equal('AUTH_TOKEN_REQUIRED')
    expect(response.error.message).is.equal('Authentication required')

    expect(response).not.haveOwnProperty('consumedServiceStatus');
    expect(response).not.haveOwnProperty('apiStatus');
    expect(response).not.haveOwnProperty('systemInformation');
    expect(isNextExecuted).false;
  })

  it("should not send health response with invalid token when the config enabled with apiSecurity", async () => {
    const customConfig = { apiPath: "/status", apiSecurity: { headerToken: "$3dsample_token"} }
    const middleware = connect(customConfig);
    mockRequest.path = "/status";
    mockRequest.headers = { "auth-token": "sample_token"}
    expect(mockRequest.path).is.equal(customConfig.apiPath);
    expect(isNextExecuted).false;
    const response = await middleware(mockRequest, mockResponse, mockNext);
    expect(response).haveOwnProperty('status');
    expect(response).haveOwnProperty('error');
    expect(response.error).haveOwnProperty('code');
    expect(response.error).haveOwnProperty('message');
    expect(response.error.code).is.equal('INVALID_AUTH_TOKEN')
    expect(response.error.message).is.equal('Authentication failed, Invalid token')

    expect(response).not.haveOwnProperty('consumedServiceStatus');
    expect(response).not.haveOwnProperty('apiStatus');
    expect(response).not.haveOwnProperty('systemInformation');
    expect(isNextExecuted).false;
  })

  it("should send health response with accurate token when the config enabled with apiSecurity", async () => {
    const customConfig = { apiPath: "/status", apiSecurity: { headerToken: "$3dsample_token"} }
    const middleware = connect(customConfig);
    mockRequest.path = "/status";
    mockRequest.headers = { "auth-token": "$3dsample_token"}
    expect(mockRequest.path).is.equal(customConfig.apiPath);
    expect(isNextExecuted).false;
    const response = await middleware(mockRequest, mockResponse, mockNext);
    expect(response).haveOwnProperty('status');
    expect(response).not.haveOwnProperty('error');
    expect(response).haveOwnProperty('consumedServiceStatus');
    expect(response).haveOwnProperty('apiStatus');
    expect(response).haveOwnProperty('systemInformation');
    expect(isNextExecuted).false;
  })
})

