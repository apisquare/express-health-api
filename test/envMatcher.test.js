const chai = require('chai');
const expect = chai.expect;
const { loadConfigPropertiesFromEnv } = require('../src/envMatcher');
const processEnvNames = require('../src/configs/processEnvConfig');

describe("should update the properties from Node ENV", () => {
  beforeEach(() => {
    process.env[processEnvNames.AUTH_TOKEN] = 'tmp_token'
  })

  it("should create API_AUTH_TOKEN from ENV if it has a valid ENV property", () => {
    const mockConfig = {}
    expect(process.env).haveOwnProperty(processEnvNames.AUTH_TOKEN);
    expect(process.env[processEnvNames.AUTH_TOKEN]).to.equal('tmp_token')
    const updatedConfig = loadConfigPropertiesFromEnv(mockConfig);
    expect(updatedConfig).haveOwnProperty("apiSecurity")
    expect(updatedConfig.apiSecurity).haveOwnProperty("headerToken")
    expect(updatedConfig.apiSecurity.headerToken).is.equal("tmp_token")
  })

  it("should update API_AUTH_TOKEN from ENV if it has a valid ENV property", () => {
    const token = "token_1";
    const mockConfig = { apiSecurity: { headerToken: token }}
    expect(process.env).haveOwnProperty(processEnvNames.AUTH_TOKEN);
    expect(process.env[processEnvNames.AUTH_TOKEN]).to.equal('tmp_token')

    const updatedConfig = loadConfigPropertiesFromEnv(mockConfig);
    expect(updatedConfig).haveOwnProperty("apiSecurity")
    expect(updatedConfig.apiSecurity).haveOwnProperty("headerToken")
    expect(updatedConfig.apiSecurity.headerToken).is.equal("tmp_token")
    expect(updatedConfig.apiSecurity.headerToken).is.not.equal(token)
  })

  it("should update base config header token from ENV if it has a valid ENV property[Not deep clone]", () => {
    const token = "token_1";
    const mockConfig = { apiSecurity: { headerToken: token }}
    expect(process.env).haveOwnProperty(processEnvNames.AUTH_TOKEN);
    expect(process.env[processEnvNames.AUTH_TOKEN]).to.equal('tmp_token')

    loadConfigPropertiesFromEnv(mockConfig);
    expect(mockConfig.apiSecurity.headerToken).is.equal("tmp_token")
    expect(mockConfig.apiSecurity.headerToken).is.not.equal(token)
  })

})