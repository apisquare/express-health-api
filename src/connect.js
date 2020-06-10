
const configValidator = require('./configValidator');
const doHealthCheck = require('./doHealthCheck');
const constants = require('./constants');
const { STATUS } = constants;

/**
 * Validate the request using the header AuthToken to increase the endpoint security
 * @param {*} apiSecurity : Boolean to indicate the API Security enabled status
 * @param {*} headers : Request Headers
 */
const authHeaderValidation = (apiSecurity, headers) => {
  const response = { status: STATUS.UP };
  if (apiSecurity) {
    const { authToken } = apiSecurity;
    const headerAuthToken = headers["auth-token"];
    if (!headerAuthToken) {
      response.error = {
          code: "AUTH_TOKEN_REQUIRED",
          message: "Authentication required"
        };
    }
    else if (headerAuthToken !== authToken) {
      response.error = {
          code: "INVALID_AUTH_TOKEN",
          message: "Authentication failed, Invalid token"
        };
    }
  }
  return response;
};

/**
 * Connects API Health Endpoint with Express server
 * @param {*} configuration : API Configuration
 */
const connect = (configuration) => {

  // TODO: How to handle it for different environments
  const config = configValidator(configuration);
  
  const middleware = async (req, res, next) => {
    if (req.path === config.apiPath) {
      const validatedResponse = authHeaderValidation(config.apiSecurity, req.headers);
      if (validatedResponse.error) {
        return res.send(validatedResponse);
      }
      
      const response = await doHealthCheck(config);
      return res.send(response);
    }
    next();
  };

  return middleware;
};

module.exports = connect;
