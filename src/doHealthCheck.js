

const apiHelper = require('./utils/apiHelper');
const constants = require('./constants');
const { collectSystemInformation } = require('./collectSystemInformation');
const { STATUS } = constants;

const doHealthCheck = async (config) => {
  const res = {
    status: STATUS.UP
  };

  const { consumedServices, apis, consumedServicesAsyncMode } = config;
  const consumedServiceStatus = {};

  if (!consumedServicesAsyncMode) {
    // Not based on parallel request
    for (let [serviceId, serviceConfig] of Object.entries(consumedServices)) {
      const { healthCheckUrl, requestMethod, expectedResponseStatus, serviceName } = serviceConfig;
      consumedServiceStatus[serviceId] = {
        serviceName,
        status: STATUS.UNKNOWN,
        requestMethod,
        healthCheckUrl,
      };
      const response = await apiHelper.performRequest(requestMethod, healthCheckUrl);
      const { status, error, duration } = response;
      if (duration) {
        consumedServiceStatus[serviceId].duration = duration;
      }
      if (error) {
        consumedServiceStatus[serviceId].status = STATUS.DOWN;
      } else {
        if (expectedResponseStatus === status) {
          consumedServiceStatus[serviceId].status = STATUS.UP;
        } else {
          consumedServiceStatus[serviceId].status = STATUS.DOWN;
        }
      }
    }
  } else {
    // Based on parallel requests
    const requestPromises = [];
    for (let [serviceId, serviceConfig] of Object.entries(consumedServices)) {
      const { healthCheckUrl, requestMethod, serviceName } = serviceConfig;
      consumedServiceStatus[serviceId] = {
        serviceName,
        status: STATUS.UNKNOWN,
        requestMethod,
        healthCheckUrl
      };
      requestPromises.push(apiHelper.performRequest(requestMethod, healthCheckUrl, null, serviceId));
    }

    // TODO : Check for allSettled migration
    const responses = await Promise.all(requestPromises);
    responses.forEach(response => {
      const { status, error, tag, duration } = response;
      if (duration) {
        consumedServiceStatus[tag].duration = duration;
      }
      if (error) {
        consumedServiceStatus[tag].status = STATUS.DOWN;
      } else {
        const { expectedResponseStatus } = consumedServices[tag];
        if (expectedResponseStatus === status) {
          consumedServiceStatus[tag].status = STATUS.UP;
        } else {
          consumedServiceStatus[tag].status = STATUS.DOWN;
        }
      }
    });
  }
  
  const apiStatus = {};
  for (let [apiId, apiConfig] of Object.entries(apis)) {
    const { apiName, requestMethod, dependsOn } = apiConfig;
    apiStatus[apiId] = {
      apiName,
      requestMethod,
      status: STATUS.UNKNOWN
    };
    
    const apiWarnings = [];
    apiStatus[apiId].status = STATUS.UP;
    dependsOn.forEach(consumedService => {
      const { serviceId, isRequired } = consumedService;
      if (isRequired) {
        if (!consumedServiceStatus[serviceId]) {
          apiStatus[apiId].status = STATUS.UNKNOWN;
          apiWarnings.push("Unknown required service " + serviceId);
        } else if (consumedServiceStatus[serviceId].status !== STATUS.UP && apiStatus[apiId].status !== STATUS.UNKNOWN) {
          apiStatus[apiId].status = STATUS.DOWN;
        }
      } 
    });

    if (apiWarnings.length > 0) {
      apiStatus[apiId].warnings = apiWarnings;
    }
  }

  const systemInformation = await collectSystemInformation(config.systemInformation);

  return {
    ...res,
    consumedServiceStatus,
    apiStatus,
    systemInformation
  };

};

module.exports = doHealthCheck;
