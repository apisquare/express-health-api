# Express Health API

![Node.js CI Build](https://github.com/APISquare/express-health-api/workflows/Node.js%20CI%20Build/badge.svg)
[![NPM version](https://img.shields.io/npm/v/express-health-api.svg)](https://www.npmjs.com/package/express-health-api)
[![codecov](https://codecov.io/gh/APISquare/express-health-api/branch/master/graph/badge.svg)](https://codecov.io/gh/APISquare/express-health-api)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/express-health-api)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=APISqure_express-health-api&metric=alert_status)](https://sonarcloud.io/dashboard?id=APISqure_express-health-api)
[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/APISquare/express-health-api/blob/master/LICENSE)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FAPISquare%2Fexpress-health-api.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FAPISquare%2Fexpress-health-api?ref=badge_shield)

Realtime Health Status API for Node applications with Express framework.

## Table of contents

1. [Features](#Features)
2. [Usage ](#Usage)
3. [Custom Health Status Configuration](#Custom-Health-Status-Configuration)
    1. [Main parts of the configurations](#Main-parts-of-the-configurations)
    2. [Custom configuration properties](#Custom-configuration-properties)
        1. [Response configuration](#Response-configuration)
        2. [API Security configuration](#API-Security-configuration)
        3. [System Information configuration](#System-Information-configuration)
        4. [Consumed services configuration](#Consumed-services-configuration)
        5. [API's configuration](#API's-configuration)
        6. [Example custom configuration](#Example-custom-configuration)
4. [Example Server](#Example-Server)
5. [Contributions](#Contributions)
6. [Development](#Development)
7. [License](#License)

## Features:
1. `/status` api to serve the health statuses
2. Custom configurations to customize your health API
3. Include CPU, Memory, Custom services(e.g: Docker) Load, Request and Response statistics with health API
4. Attach status of the dependent services/consumed services with your health API
5. Customize your server API statuses with dependent services/consumed services
6. Secure your health endpoint before exposing your server related details

## Usage

Supports to Node.js versions 8.x and above.

1. Install the dependency to your Node.js project by using any of the following commands,
   - NPM : `npm install express-health-api --save`
   - Yarn : `yarn add express-health-api`
2. Create your custom configurations for the status api [Follow here] or you can go ahead with default configurations.
3. Go to your main file where you initialized the express server, and place the line before any middleware or routes.
```javascript
const expressHealthApi = require('express-health-api');
app.use(expressHealthApi())
```
4. Start your server and go to the health API endpoint (default: `<your_server_address>/status`)
---

## Custom Health Status Configuration

You can customize the health API for your needs, and this will send the response based on those custom configurations. 

  ```javascript
  const expressHealthApi = require('express-health-api');
  app.use(expressHealthApi({ apiPath: "/health" } ))
  ```

Or, you can create configuration file for HealthAPI and attach it with the initialization method,
1. Create a custom configuration file in your project (e.g: `/src/config/healthApi.config.json`)
2. Import that configuration file to your main file, and pass the configuration to `expressHealthApi` initiation.


  ```javascript
  const expressHealthApi = require('express-health-api');
  const customHealthApiConfiguration = require('./config/healthApi.config.json')
  app.use(expressHealthApi(customHealthApiConfiguration))
  ```

### Main parts of the configurations

| Property | Mandatory | Default value | Description |
| ------- | ---  | ------------- | ----------- |
| apiPath | - | "/status" | API path name |
| apiSecurity | - | false | Secure health API with auth token |
| response| - | { Object with all true } | Response object customization (You can avoid unwanted properties from health API response) |
| systemInformation | -  | { Object with all true } | Customize required system information properties |
| consumedServicesAsyncMode | -  | true | Consumed services health check method(Async or Sync based requests to endpoints) |
| consumedServices | - | { } | Configuration of all the consumed services |
| apis | - | { } | Configuration of all available APIs in the server |
| | |

### Custom configuration properties

Follow the steps to create your custom configuration file for health API.

1. #### Response configuration

    | Property | Mandatory | Default value | Description |
    | -------  | --------  | ------------- | ----------- |
    | statusCodes | - | true | Include status codes of health checks with response |
    | | |

2. #### API Security configuration

    You can use this property to secure your health API if you don't want to expose all of your data outside. You can enable API Security with header token,

    ```json
    ...
    "apiSecurity": { "authToken": "YOUR_TOKEN" }
    ...
    ```

    | Property | Mandatory | Default value | Description |
    | -------  | --------  | ------------- | ----------- |
    | authToken | &check; | Disable API Security | Token to restrict the unauthorized access to your health API |
    | | |

    when you enable API Security for health API,

    - You have to attach `auth-token` to the request header to access the health API
        ```shell
        curl -i -H "auth-token:1234567" "http://localhost:5000/status"
        ```
    - Health API requests without valid `auth-token` in header will get the following response (anyway it will send `200` - Success response)
      ```json
        Response Status: 200
        Response: {
          "status": "up",
          "error": {
            "code": "AUTH_TOKEN_REQUIRED",
            "message": "Authentication required"
          }
        }
      ```
    **If you like to have different AUTH_TOKEN for each environment,** you can update the AUTH_TOKEN through ENV properties. 

    - Add `HEALTH_API_AUTH_TOKEN` to your `.env` file or ENV properties
      ```
      ...
      HEALTH_API_AUTH_TOKEN=<your_token>
      ...
      ```



3. #### System Information configuration

    | Property | Mandatory | Default value | Description |
    | -------  | --------  | ------------- | ----------- |
    | systemInformation | - | { Object with all true } | Customize the system related information |
    | ── common | - | true | Retrieve common(OS, Uptime) information |
    | ── cpu | - | true | Retrieve CPU(Cores, Speeds) information |
    | ── memory | - | true | Retrieve memory(Total, Free) information |
    | ── services | - | undefined | Retrieve running service information from the server (Array of process names) |
    | | |

    This is the example configuration to configure required system information,
    ```json
      ...
      "systemInformation": {
        "common": true,
        "cpu": true,
        "memory": true,
        "services": ["mysql", "apache2", "docker"]
      }
      ...
    ```

4. #### Consumed services configuration

    Structure should follow this pattern : `{ serviceId: { ...service object } }`. Service object properties are,

    | Property | Mandatory | Default value | Description |
    | -------  | --------- | ------------- | ----------- |
    | serviceName | - | Unknown service name | Name to indicate the consumed service |
    | healthCheckUrl | &check; | - | Health check endpoint of the service |
    | requestMethod | - | GET | Request method of the health check URL (GET/POST/PUT/PATCH/HEAD/DELETE) |
    | expectedResponseStatus | - | 200 | Expected response status code from the health check endpoint |
    | | |

5. #### API's configuration

    Structure should follow this pattern : `{ apiId: { ...api object } }`. API object properties are,

    | Property | Mandatory | Default value | Description |
    | -------  | --------- | ------------- | ----------- |
    | api | - | Unknown API name | Name to indicate the API in the server |
    | requestMethod | - | GET | Request method of the API (GET/POST/PUT/PATCH/HEAD/DELETE) |
    | dependsOn | - | { } | Services configuration which this API depends on |
    | ── serviceId | &check; | - | ServiceId which mentioned in the consumed services section |
    | ── isRequired |  - | true | Is this service required to serve this API (down this API if this service went down) |
    | | |

6. #### Example custom configuration

    ```json
    {
      "apiPath": "/status",
      "response": {
        "statusCodes": true,
      },
      "systemInformation": {
        "common": true,
        "cpu": true,
        "memory": true,
        "services": ["mysql", "apache2"]
      },
      "consumedServicesAsyncMode": false,
      "consumedServices": {
        "mockService1": {
          "serviceName": "Mock Service 1",
          "healthCheckUrl": "https://sampleHealthcheckUrl-1",
          "requestMethod": "GET",
          "expectedResponseStatus": 200
        }
      },
      "apis": { 
        "getUser": {
          "apiName": "Get Users",
          "requestMethod": "GET",
          "dependsOn": [
            {
              "serviceId": "mockService1",
              "isRequired": true
            }
          ]
        },
      }
    }
    ```

    Minimal custom configuration would be simple as this(you can ignore other properties as those will be filled with default values through the process),

    ```json
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

    Find the test-server [custom configurations here](https://github.com/APISquare/express-health-api/blob/master/test-server/healthApi.config.json) as an example.

## Example Server

This project has an example project configured with custom configurations. To run that project and see the outputs follow these steps,
1. Clone this repository : `git clone https://github.com/RafalWilinski/express-status-monitor`
2. Go inside the test-server folder : `cd express-status-monitor/test-server`
3. Install the required dependencies : `npm install` or `yarn`
4. Start the server : `npm start` or `yarn start`
5. Go to [https://localhost:5000/status](https://localhost:5000/status) and get the experience of express-health-api.

## Contributions

You can add any suggestions/feature requirements/bugs to the Github issues page : [https://github.com/APISquare/express-health-api/issues](https://github.com/APISquare/express-health-api/issues)

Add your fixes and development changes as pull requests to this [repository](https://github.com/APISquare/express-health-api/pulls).

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

This project is configured to validate the test cases and lint issues before each commit. So don't bypass the commit with any issues in your changes.

## License

[MIT License](https://opensource.org/licenses/MIT)

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FAPISquare%2Fexpress-health-api.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FAPISquare%2Fexpress-health-api?ref=badge_large)

