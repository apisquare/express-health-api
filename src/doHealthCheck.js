

const apiHelper = require('./utils/apiHelper')
const constants = require('./constants')
const { STATUS } = constants;

const doHealthCheck = async (config) => {
  const res = {
    status: STATUS.UP
  }

  const { consumedServices, apis } = config;

  const consumedServiceStatus = {};
  for (let [serviceId, serviceConfig] of Object.entries(consumedServices)) {
    const { healthCheckUrl, requestMethod, expectedResponseStatus, serviceName, isRequired } = serviceConfig;
    consumedServiceStatus[serviceId] = {
      serviceName,
      isRequired,
      status: STATUS.UNKNOWN
    }
    const response = await apiHelper.performRequest(requestMethod, healthCheckUrl);
    const { status, error } = response;
    if (error) {
      consumedServiceStatus[serviceId].status = STATUS.DOWN
    } else {
      if (expectedResponseStatus === status) {
        consumedServiceStatus[serviceId].status = STATUS.UP
      } else {
        consumedServiceStatus[serviceId].status = STATUS.DOWN
      }
    }
  }

  // TODO: API Status 
  const apiStatus = {}
  for (let [apiId, apiConfig] of Object.entries(apis)) {
    const { apiName, requestMethod, dependsOn } = apiConfig;
    apiStatus[apiId] = {
      apiName,
      requestMethod,
      status: STATUS.UNKNOWN
    }
    
    apiStatus[apiId].status = STATUS.UP;
    dependsOn.forEach(consumedService => {
      const { serviceId, isRequired } = consumedService;
      if (isRequired && consumedServiceStatus[serviceId].status !== STATUS.UP) {
        apiStatus[apiId].status = STATUS.DOWN;
      }
    });
  }

  return {
    ...res,
    consumedServiceStatus,
    apiStatus
  }

}

module.exports = doHealthCheck;
