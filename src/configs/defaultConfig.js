
const defaultConfig = {
  apiPath: '/status',
  response: {
    statusCodes: true
  },
  consumedServices: {
    abcService: {
      serviceName: 'ABC Service',
      healthCheckUrl: '#',
      requestMethod: 'GET',
      expectedResponseStatus: '200',
      isRequired: true
    }
  },
  apis: {
    login: {
      apiName: 'Login API',
      requestMethod: 'GET',
      dependsOn: ["abcService"]
    }
  }
}

module.exports = defaultConfig
