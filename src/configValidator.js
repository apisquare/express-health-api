// TODO: Remove this eslint issue
/* eslint-disable no-unused-vars */

const defaultConfig = require('./configs/defaultConfig');
const { REQUEST_TYPES } = require('./utils/apiHelper');
const { loadConfigPropertiesFromEnv } = require('./envMatcher');

const configValidator = apiConfiguration => {
  let config = apiConfiguration;
  if (!config) {
    const defaultConfigForServer = require('./configs/defaultConfig config.json');
    return defaultConfigForServer;
  }

  // Fetch the properties from ENVs
  config = loadConfigPropertiesFromEnv(config);

  // Assigning isDefault false to indicate the custom config
  config.isDefault = false;

  config.apiPath = config.apiPath || defaultConfig.apiPath;
  if (config.consumedServicesAsyncMode == undefined || typeof config.consumedServicesAsyncMode !== "boolean") {
    config.consumedServicesAsyncMode = defaultConfig.consumedServicesAsyncMode;
  }
  
  // Validate API Security
  if (typeof config.apiSecurity === 'object') {
    const { authToken } = config.apiSecurity;
    if (!authToken) {
      config.apiSecurity = false;
    }
  } else {
    config.apiSecurity = false;
  }

  // Validate responses
  if (config.response) {
    const { statusCodes } = config.response;
    if (typeof statusCodes !== "boolean") {
      config.response.statusCodes = defaultConfig.response.statusCodes;
    }
  } else {
    config.response = defaultConfig.response;
  }

  // Validate SystemInformation
  if (config.systemInformation != undefined) {
    const { systemInformation } = config;
    if (typeof systemInformation === "boolean") {
      if (systemInformation == true) {
        config.systemInformation = defaultConfig.systemInformation;
      } else {
        config.systemInformation = {
          common: false,
          cpu: false,
          memory: false
        };
      }
    } else if (typeof systemInformation === "object") {
      const { common, cpu, memory, services } = systemInformation;
      if (typeof common !== "boolean") {
        systemInformation.common = true;
      }
      if (typeof cpu !== "boolean") {
        systemInformation.cpu = defaultConfig.systemInformation.cpu;
      }
      if (typeof memory !== "boolean") {
        systemInformation.memory = defaultConfig.systemInformation.memory;
      }
      if (services && Array.isArray(services)) {
        systemInformation.services = services.join();
      }
    } else {
      config.systemInformation = defaultConfig.systemInformation;
    }
  } else {
    config.systemInformation = defaultConfig.systemInformation;
  }

  // validate consumed services
  if (config.consumedServices) {
    const defaultServiceConfig = defaultConfig.consumedServices.defaultServiceId;
    for (let [serviceId, serviceConfig] of Object.entries(config.consumedServices)) {
      if (serviceConfig) {
        serviceConfig.isValid = true;
        serviceConfig.serviceName =  serviceConfig.serviceName || defaultServiceConfig.serviceName;
        if (!serviceConfig.healthCheckUrl) {
          serviceConfig.isValid = false;
        }

        if (!serviceConfig.requestMethod) {
          serviceConfig.requestMethod = defaultServiceConfig.requestMethod;
        }
        serviceConfig.requestMethod = serviceConfig.requestMethod.toUpperCase();
        if (!REQUEST_TYPES[serviceConfig.requestMethod]) {
          serviceConfig.isValid = false;
        }

        if (!serviceConfig.expectedResponseStatus) {
          serviceConfig.expectedResponseStatus = defaultServiceConfig.expectedResponseStatus;
        }
        // TODO: Check expectedResponseStatus for valid integer

        if (!serviceConfig.isRequired || typeof serviceConfig.isRequired !== "boolean") {
          serviceConfig.isRequired = defaultServiceConfig.isRequired;
        }
      }
    }
  } else {
    config.consumedServices = {};
  }

  // validate apis
  if (config.apis) {
    const defaultApiConfig = defaultConfig.apis.defaultApi;
    for (let [apiId, apiConfig] of Object.entries(config.apis)) {
      apiConfig.apiName = apiConfig.apiName || defaultApiConfig.apiName;
      if (!apiConfig.requestMethod) {
        apiConfig.requestMethod = defaultApiConfig.requestMethod;
      }
     
      apiConfig.requestMethod = apiConfig.requestMethod.toUpperCase();
      if (!REQUEST_TYPES[apiConfig.requestMethod]) {
        apiConfig.requestMethod = defaultApiConfig.requestMethod;
      }
      if (!apiConfig.dependsOn || !Array.isArray(apiConfig.dependsOn)) {
        apiConfig.dependsOn = [];
      }

      apiConfig.dependsOn.forEach(dependsOnConfig => {
        dependsOnConfig.isValid = true;
        if (!dependsOnConfig.serviceId) {
          dependsOnConfig.isValid = false;
        }
        if (!config.consumedServices[dependsOnConfig.serviceId]) {
          dependsOnConfig.isValid = false;
        }
        if (dependsOnConfig.isRequired == undefined || typeof dependsOnConfig.isRequired !== "boolean") {
          dependsOnConfig.isRequired = defaultConfig.apis.defaultApi.dependsOn[0].isRequired;
        }
      });
    }
  } else {
    config.apis = {};
  }
  return config;
};

module.exports = configValidator;
