const defaultConfig = {
  apiPath: '/status',
  mode: "AUTO", // AUTO, ON_REQUEST
  scheduler: {
    defaultInterval: 2, // s
    maxTriggers: 10
  },
  response: {
    statusCodes: true
  },
  consumedServices: {
    mockService1: {
      serviceName: 'Mock Service 1',
      healthCheckUrl: 'https://reqres.in/api/users?page=1',
      requestMethod: 'GET',
      expectedResponseStatus: 200,
      isRequired: true
    },
    mockService2: {
      serviceName: 'Mock Service 2',
      healthCheckUrl: 'https://reqres11111.in/api/users?page=2',
      requestMethod: 'GET',
      expectedResponseStatus: 200,
      isRequired: true
    },
    mockService3: {
      serviceName: 'Mock Service 3',
      healthCheckUrl: 'https://reqres.in/api/users/2',
      requestMethod: 'GET',
      expectedResponseStatus: 200,
      isRequired: true
    }
  },
  apis: {
    getUser: {
      apiName: 'Get Users',
      requestMethod: 'GET',
      dependsOn: [{ serviceId: "mockService1", isRequired: true}, { serviceId: "mockService2", isRequired: true}]
    },
    getUsers: {
      apiName: 'Get User',
      requestMethod: 'GET',
      dependsOn: [{ serviceId: "mockService4", isRequired: true}]
    }
  }
}

module.exports = defaultConfig
