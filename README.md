# Express Health API

![Node.js CI](https://github.com/APISqure/express-health-api/workflows/Node.js%20CI/badge.svg?branch=master)
[![NPM version](https://img.shields.io/npm/v/express-health-api.svg)](https://www.npmjs.com/package/express-health-api)
[![codecov](https://codecov.io/gh/APISqure/express-health-api/branch/master/graph/badge.svg)](https://codecov.io/gh/APISqure/express-health-api)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FAPISqure%2Fexpress-health-api.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FAPISqure%2Fexpress-health-api?ref=badge_shield)


Realtime Health Status API for Node applications with Express framework.

## Features:
1. `/status` api to serve the health statuses
2. Custom configurations to customize your health API
3. Include CPU, Memory, Load, Request and Response statistics with health API
4. Attach status of the dependent services/consumed services with your health API
5. Customize your server API statuses with dependent services/consumed services


## Setup

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

