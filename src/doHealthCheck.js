

const apiHelper = require('./utils/apiHelper')
const constants = require('./constants')
const { STATUS } = constants;

const doHealthCheck = async (config) => {
  const res = {
    status: STATUS.UP
  }

  const { consumedServices, apis } = config;

  const requestPromises = [];
  const consumedServiceStatus = {};
  for (let [serviceId, serviceConfig] of Object.entries(consumedServices)) {
    const { healthCheckUrl, requestMethod, serviceName, isRequired } = serviceConfig;
    consumedServiceStatus[serviceId] = {
      serviceName,
      isRequired,
      status: STATUS.UNKNOWN
    }
    requestPromises.push(apiHelper.performRequest(requestMethod, healthCheckUrl, null, serviceId));
  }
  const responses = await Promise.all(requestPromises);
  responses.forEach(response => {
    const { status, error, tag } = response;
    if (error) {
      consumedServiceStatus[tag].status = STATUS.DOWN
    } else {
      const { expectedResponseStatus } = consumedServices[tag]
      if (expectedResponseStatus === status) {
        consumedServiceStatus[tag].status = STATUS.UP
      } else {
        consumedServiceStatus[tag].status = STATUS.DOWN
      }
    }
  });


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
