
const defaultConfig = {
  isDefault: true,
  apiPath: '/status',
  response: {
    statusCodes: true,
    statusText: true,
    time: true,
  },
  consumedServicesAsyncMode: true,
  consumedServices: {
    defaultServiceId: {
      serviceName: 'Unknown service name',
      healthCheckUrl: '/',
      requestMethod: 'GET',
      expectedResponseStatus: '200'
    }
  },
  apis: {
    defaultApi: {
      apiName: 'Unknown API name',
      requestMethod: 'GET',
      dependsOn: [{ serviceId: "defaultServiceId", isRequired: true}]
    }
  }
};

module.exports = defaultConfig;
