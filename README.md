# Express Health API

![Node.js CI Build](https://github.com/APISqure/express-health-api/workflows/Node.js%20CI%20Build/badge.svg)
[![NPM version](https://img.shields.io/npm/v/express-health-api.svg)](https://www.npmjs.com/package/express-health-api)
[![codecov](https://codecov.io/gh/APISqure/express-health-api/branch/master/graph/badge.svg)](https://codecov.io/gh/APISqure/express-health-api)
[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/APISqure/express-health-api/blob/master/LICENSE)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FAPISqure%2Fexpress-health-api.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FAPISqure%2Fexpress-health-api?ref=badge_shield)

Realtime Health Status API for Node applications with Express framework.

## Features:
1. `/status` api to serve the health statuses
2. Custom configurations to customize your health API
3. Include CPU, Memory, Load, Request and Response statistics with health API
4. Attach status of the dependent services/consumed services with your health API
5. Customize your server API statuses with dependent services/consumed services


## Installation & Setup 

Supports to Node.js versions 8.x and above.

1. Install the dependency to your Node.js project by using any of the following commands,
   - NPM : `npm install express-health-api --save`
   - Yarn : `yarn add express-health-api`
2. Create your custom configurations for the status api [Follow here] or you can go ahead with default configurations.
3. Go to your main file where you initialized the express server, and place the line before any middleware or routes.
```
const expressHealthApi = require('express-health-api');
app.use(expressHealthApi())
```
4. Start your server and go to the health API endpoint (default: `<your_server_address>/status`)
---

## Custom Health Status Configuration

You can customize the health API for your needs, and this well send the response based on those custom configurations. 

1. Create a custom configuration file in your project (e.g: `/src/config/healthApi.config.json`)
2. Import that configuration file to your main file, and pass the configuration to `expressHealthApi` initiation.
```
const expressHealthApi = require('express-health-api');
const customHealthApiConfiguration = require('./config/healthApi.config.json')
app.use(expressHealthApi(customHealthApiConfiguration))
```

### Custom configuration properties

Follow the steps to create your custom configuration file for health API.

#### Main parts of the configurations,

| Property | Mandatory | Default value | Description |
| ------- | ---  | ------------- | ----------- |
| apiPath | &#9744; | "/status" | API path name |
| response| &#9744; | { Object with all true } | Response object customization (You can avoid unwanted properties from health API response) |
| consumedServicesAsyncMode | &#9744;  | true | Consumed services health check method(Async or Sync based requests to endpoints) |
| consumedServices | &#9744; | { } | Configuration of all the consumed services |
| apis | &#9744; | { } | Configuration of all available APIs in the server |
| | |

#### Response configuration

| Property | Mandatory | Default value | Description |
| -------  | --------  | ------------- | ----------- |
| statusCodes | &#9744; | true | Include status codes of health checks with response |
| systemInfo | &#9744; | { Object with all true } | Include system information with response |
| ── common | &#9744; | true | Include common(OS, Uptime) information with response |
| ── cpu | &#9744; | true | Include CPU(Cores, Speeds) information with response |
| ── memory | &#9744; | true | Include memory(Total, Free) information with response |
| | |

#### Consumed services configuration

Structure should follow this pattern : `{ serviceId: { ...service object } }`. Service object properties are,

| Property | Mandatory | Default value | Description |
| -------  | --------- | ------------- | ----------- |
| serviceName | &#9744; | Unknown service name | Name to indicate the consumed service |
| healthCheckUrl | &check; | - | Health check endpoint of the service |
| requestMethod | &#9744; | GET | Request method of the health check URL (GET/POST/PUT/PATCH/HEAD/DELETE) |
| expectedResponseStatus | &#9744; | 200 | Expected response status code from the health check endpoint |
| | |

#### API's configuration

Structure should follow this pattern : `{ apiId: { ...api object } }`. API object properties are,

| Property | Mandatory | Default value | Description |
| -------  | --------- | ------------- | ----------- |
| api | &#9744; | Unknown API name | Name to indicate the API in the server |
| requestMethod | &#9744; | GET | Request method of the API (GET/POST/PUT/PATCH/HEAD/DELETE) |
| dependsOn | &#9744; | { } | Services configuration which this API depends on |
| ── serviceId | &check; | - | ServiceId which mentioned in the consumed services section |
| ── isRequired |  &#9744; | true | Is this service required to serve this API (down this API if this service went down) |
| | |

#### Example custom configuration, 

```
{
  "apiPath": "/status",             // API Path Name [String]
  "response": {                     // Response configuration [Object]
    "statusCodes": true,            // Attach statusCodes with responses [Boolean]
    "systemInfo": {                 // Attach system information with responses [Boolean/Object]
        "common": true,             // Attach common information to systemInfo [Boolean]
        "cpu": true,                // Attach cpu information to systemInfo [Boolean]
        "memory": true              // Attach memory information to systemInfo [Boolean]
    }
  },
  "consumedServicesAsyncMode": false,   // Consumed Services request mode [Boolean]
  "consumedServices": {                 // Consumed services configuration [Object]
    "mockService1": {                   // Consumed serviceId : service configuration object
      "serviceName": "Mock Service 1",  // Service Name [String]
      "healthCheckUrl": "https://sampleHealthcheckUrl-1",   // Service health check URL [String]
      "requestMethod": "GET",                                   // Service health check URL request method [String]
      "expectedResponseStatus": 200                             // Expected response from health check request [Integer]
    }
  },
  "apis": {                             // Available APIs configuration in the server [Object]
    "getUser": {                        // API id: apiConfiguration object
      "apiName": "Get Users",           // API Name [String]
      "requestMethod": "GET",           // API request method [String]
      "dependsOn": [                    // Service dependents for this API configuration [Array]
        {
          "serviceId": "mockService1",      // Dependent serviceId [String]
          "isRequired": true                // Is required to this API [Boolean]
        }
      ]
    },
  }
}
```

Minimal custom configuration would be like this as much simple (avoided other properties as those will be filled with default values through the process),

```
{
  "consumedServices": {                 
    "mockService1": {                   
      "serviceName": "Mock Service 1",  
      "healthCheckUrl": "https://sampleHealthcheckUrl-1",
    },
    "mockService2": {                   
      "serviceName": "Mock Service 2",  
      "healthCheckUrl": "https://sampleHealthcheckUrl-2",
    }
  },
  "apis": {                             
    "getUser": {                        
      "apiName": "Get Users",           
      "dependsOn": [{ "serviceId": "mockService1" }]
    },
    "getAddress": {                        
      "apiName": "Get Address",           
      "dependsOn": [{ "serviceId": "mockService1" }, { "serviceId": "mockService2" }]
    },
  }
}
```

Find the test-server [custom configurations here](https://github.com/APISqure/express-health-api/blob/master/test-server/healthApi.config.json) as an example.

## Example Server

This project has an example project configured with custom configurations. To run that project and see the outputs follow these steps,
1. Clone this repository : `git clone https://github.com/RafalWilinski/express-status-monitor`
2. Go inside the test-server folder : `cd express-status-monitor/test-server`
3. Install the required dependencies : `npm install` or `yarn`
4. Start the server : `npm start` or `yarn start`
5. Go to [https://localhost:5000/status](https://localhost:5000/status) and get the experience of express-health-api.

## Contributions

You can add any suggestions/feature requirements/bugs to the Github issues page : [https://github.com/APISqure/express-health-api/issues](https://github.com/APISqure/express-health-api/issues)

Add your fixes and development changes as pull requests to this [repository](https://github.com/APISqure/express-health-api/pulls).

## Development

Folder structure of the project, 

    ├── docs                    # Documentation files
    ├── src                     # Source files
    ├── test                    # Project tests
    ├── test-server             # Example server project
    ├── .nycrc                  # Coverage configurations
    ├── .index.js               # Main exported file
    └── README.md

- To run the test cases: `npm test` or `yarn test`
- To get the coverage of the project: `npm coverage` or `yarn coverage`
- To get the lint issues in the changes: `npm lint` or `yarn lint`
- To fix your lint issues: `npm lint:fix` or `yarn lint:fix`

This project configured to validate the tests cases and lint issues before each commits. So don't by pass the commit with any issues in your changes.

## License

[MIT License](https://opensource.org/licenses/MIT)

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FAPISqure%2Fexpress-health-api.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FAPISqure%2Fexpress-health-api?ref=badge_large)

